from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import PyJWTError

from src.models.users import UserRole, Users
from src.modules.auth.tokens import decode_access_token
from src.sql import auth as auth_sql

bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),) -> Users:
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        claims = decode_access_token(credentials.credentials)
        user = auth_sql.get_user_by_id(int(claims["sub"]))
    except (PyJWTError, KeyError, TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account unavailable",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


def require_roles(*allowed: UserRole):
    """
    Factory. Use like:
        Depends(require_roles(UserRole.ADMIN))
        Depends(require_roles(UserRole.USER, UserRole.ADMIN))
    """
    def _dep(user: Users = Depends(get_current_user)) -> Users:
        if user.role not in allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )
        return user
    return _dep


# Convenience aliases for common cases
require_any_user = get_current_user                                    # GUEST, USER, ADMIN
require_registered_user = require_roles(UserRole.USER, UserRole.ADMIN) # blocks GUEST
require_admin = require_roles(UserRole.ADMIN)
