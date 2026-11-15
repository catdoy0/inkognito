import json

from fastapi import APIRouter, Cookie, HTTPException, Request, Response
from google.auth.exceptions import GoogleAuthError
from google.auth.transport.requests import Request as GoogleRequest
from google.oauth2 import id_token
from jwt import PyJWTError

from src.config import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    AUTH_COOKIE_OPTIONS,
    GOOGLE_CLIENT_ID,
    REFRESH_TOKEN_EXPIRE_DAYS,
)
from src.modules.auth.auth import (
    get_current_user_id,
    refresh_session,
    revoke_refresh_token,
    serialize_user,
    signin_user,
    signup_user,
)
from src.modules.auth.google_oauth import signin_google_user
from src.modules.auth.tokens import decode_access_token
from src.schemas.auth import (
    CheckEmailRequest,
    GoogleSignInRequest,
    LoginRequest,
    SignUpRequest,
)
from src.sql import auth as auth_sql

router = APIRouter(tags=["auth"])


# ACCESS_MAX_AGE = ACCESS_TOKEN_EXPIRE_MINUTES * 60
REFRESH_MAX_AGE = REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60


def _set_refresh_cookie(response: Response, refresh_token: str) -> None:
    response.set_cookie(
        "refresh_token",
        refresh_token,
        max_age=REFRESH_MAX_AGE,
        path="/",
        **AUTH_COOKIE_OPTIONS,
    )


def _auth_payload(response: Response, user, access_token: str, refresh_token: str) -> dict:
    """
    Standard auth response:
      - refresh_token: HttpOnly cookie (browser stores it, JS can't read it)
      - access_token: JSON body (client saves in Redux memory)
    """
    _set_refresh_cookie(response, refresh_token)
    return {
        "access_token": access_token,
        "token_type": "Bearer",
        "user": serialize_user(user),
    }


@router.post("/signup")
def signup(data: SignUpRequest, response: Response):
    user, access_token, refresh_token = signup_user(data)
    return _auth_payload(response, user, access_token, refresh_token)


@router.post("/signin")
def signin(data: LoginRequest, response: Response):
    user, access_token, refresh_token = signin_user(data)
    return _auth_payload(response, user, access_token, refresh_token)


@router.post("/google-signin")
def google_signin(data: GoogleSignInRequest, response: Response):
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=503, detail="Google sign-in is not configured")

    try:
        claims = id_token.verify_oauth2_token(
            data.credential,
            GoogleRequest(),
            GOOGLE_CLIENT_ID,
        )
        print(json.dumps(claims, indent=2))

    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid Google credential")
    except GoogleAuthError:
        raise HTTPException(status_code=503, detail="Could not verify Google credential")

    if claims.get("email_verified") is not True:
        raise HTTPException(status_code=401, detail="Google email is not verified")

    user, access_token, refresh_token = signin_google_user(claims) # type: ignore
    return _auth_payload(response, user, access_token, refresh_token)


@router.post("/refresh")
def refresh(
    response: Response,
    refresh_token: str | None = Cookie(default=None)
):
    """
    Client-only. Rotates the refresh cookie and returns a new access token.
    Called:
      - on app mount (rehydrate Redux after refresh)
      - by Axios 401 interceptor (silent refresh)
    """
    # refresh_token = request.cookies.get("refresh_token")

    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token is missing")

    user, new_access, new_refresh = refresh_session(refresh_token)
    return _auth_payload(response, user, new_access, new_refresh)


@router.post("/logout", summary="Revoke the refresh token and clear the cookie")
def logout(
    response: Response,
    refresh_token: str | None = Cookie(default=None),
):
    revoke_refresh_token(refresh_token)
    response.delete_cookie("refresh_token", path="/")
    return {"message": "Logged out"}


@router.post("/check-email-taken")
def check_email_taken(data: CheckEmailRequest):
    return {
        "email": data.email,
        "taken": auth_sql.email_exists(data.email),
    }
