import secrets

from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError

from src.models.users import Users
from src.modules.auth.auth import issue_token_pair
from src.modules.auth.passwords import hash_password
from src.sql import auth as auth_sql


def signin_google_user(claims: dict) -> tuple[Users, str, str]:
    google_id = claims.get("sub")
    email = claims.get("email")
    if not isinstance(google_id, str) or not google_id or not isinstance(email, str):
        raise HTTPException(status_code=401, detail="Google account is missing required profile data")

    email = email.strip().lower()
    user = auth_sql.get_user_by_oauth("google", google_id)

    if user is None:
        existing = auth_sql.get_user_record_by_email(email)
        if existing is not None:
            if not existing.is_active:
                raise HTTPException(status_code=403, detail="Account is disabled")

            # Google is authoritative for Gmail addresses and verified Workspace accounts.
            google_is_authoritative = (
                email.endswith("@gmail.com") or bool(claims.get("hd"))
            )
            if not google_is_authoritative:
                raise HTTPException(
                    status_code=409,
                    detail="Sign in with your password first to link this Google account",
                )

            user = auth_sql.link_google_identity(
                existing.id, # type: ignore
                google_id,
                claims.get("picture"),
            )
            if user is None:
                user = auth_sql.get_user_by_oauth("google", google_id)
        else:
            given_name = claims.get("given_name")
            family_name = claims.get("family_name")
            user = Users(
                first_name=(given_name or "")[:50] or None,
                last_name=(family_name or "")[:50] or None,
                email=email,
                # OAuth-only accounts still satisfy the existing non-null password column.
                password_hash=hash_password(secrets.token_urlsafe(48)),
                oauth_provider="google",
                oauth_id=google_id,
                avatar_url=(claims.get("picture") or "")[:500] or None,
            )
            try:
                user = auth_sql.add_user(user)
            except IntegrityError:
                # Handle two simultaneous first sign-ins for the same Google account.
                user = auth_sql.get_user_by_oauth("google", google_id)
                if user is None:
                    raise HTTPException(
                        status_code=409,
                        detail="An account with this email already exists",
                    )

    if user is None:
        raise HTTPException(status_code=409, detail="Unable to link this Google account")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is disabled")

    auth_sql.delete_expired_refresh()
    if user.id:
        auth_sql.update_last_sign_in(user.id)
    access_token, refresh_token = issue_token_pair(user)
    return user, access_token, refresh_token
