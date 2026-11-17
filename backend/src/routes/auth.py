from fastapi import APIRouter, Cookie, Depends, HTTPException, Response, status
from google.auth.exceptions import GoogleAuthError
from google.auth.transport.requests import Request as GoogleRequest
from google.oauth2 import id_token

from src.config import AUTH_COOKIE_OPTIONS, GOOGLE_CLIENT_ID, REFRESH_TOKEN_EXPIRE_DAYS
from src.models.users import Users
from src.modules.auth.auth import (
    refresh_session,
    revoke_refresh_token,
    serialize_user,
    signin_user,
    signup_user,
)
from src.modules.auth.dependencies import get_current_user
from src.modules.auth.google_oauth import signin_google_user
from src.schemas.auth import (
    AuthResponse,
    CheckEmailRequest,
    CheckEmailResponse,
    GoogleSignInRequest,
    LoginRequest,
    MessageResponse,
    SignUpRequest,
    UserResponse,
)
from src.sql import auth as auth_sql

router = APIRouter(tags=["auth"])


REFRESH_MAX_AGE = REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60


def _set_refresh_cookie(response: Response, refresh_token: str) -> None:
    response.set_cookie(
        "refresh_token",
        refresh_token,
        max_age=REFRESH_MAX_AGE,
        path="/",
        **AUTH_COOKIE_OPTIONS,
    )


def _auth_payload(
    response: Response,
    user: Users,
    access_token: str,
    refresh_token: str,
) -> dict:
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


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def signup(data: SignUpRequest, response: Response) -> dict:
    user, access_token, refresh_token = signup_user(data)
    return _auth_payload(response, user, access_token, refresh_token)


@router.post("/signin", response_model=AuthResponse)
def signin(data: LoginRequest, response: Response) -> dict:
    user, access_token, refresh_token = signin_user(data)
    return _auth_payload(response, user, access_token, refresh_token)


@router.post("/google-signin", response_model=AuthResponse)
def google_signin(data: GoogleSignInRequest, response: Response) -> dict:
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=503, detail="Google sign-in is not configured")

    try:
        claims = id_token.verify_oauth2_token(
            data.credential,
            GoogleRequest(),
            GOOGLE_CLIENT_ID,
        )
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid Google credential")
    except GoogleAuthError:
        raise HTTPException(status_code=503, detail="Could not verify Google credential")

    if claims.get("email_verified") is not True:
        raise HTTPException(status_code=401, detail="Google email is not verified")

    user, access_token, refresh_token = signin_google_user(claims) # type: ignore
    return _auth_payload(response, user, access_token, refresh_token)


@router.post("/refresh", response_model=AuthResponse)
def refresh(
    response: Response,
    refresh_token: str | None = Cookie(default=None, description="HttpOnly refresh token cookie"),
) -> dict:
    """
    Client-only. Rotates the refresh cookie and returns a new access token.
    Called:
      - on app mount (rehydrate Redux after refresh)
      - by Axios 401 interceptor (silent refresh)
    """
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token is missing")

    user, new_access, new_refresh = refresh_session(refresh_token)
    return _auth_payload(response, user, new_access, new_refresh)


@router.post(
    "/logout",
    summary="Revoke the refresh token and clear the cookie",
    response_model=MessageResponse,
)
def logout(
    response: Response,
    refresh_token: str | None = Cookie(default=None, description="HttpOnly refresh token cookie"),
) -> dict[str, str]:
    revoke_refresh_token(refresh_token)
    response.delete_cookie("refresh_token", path="/", **AUTH_COOKIE_OPTIONS)
    return {"message": "Logged out"}


# @router.get("/me", response_model=UserResponse)
# def me(user: Users = Depends(get_current_user)) -> Users:
#     """Return the signed-in user using the bearer access token."""
#     return user


@router.post("/check-email-taken", response_model=CheckEmailResponse)
def check_email_taken(data: CheckEmailRequest) -> dict:
    return {
        "email": data.email,
        "taken": auth_sql.email_exists(data.email),
    }
