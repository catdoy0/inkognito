import os
from enum import Enum

from dotenv import load_dotenv

load_dotenv()


class DatabaseKind(str, Enum):
    POSTGRES = "postgres"
    SQLITE = "sqlite"
    UNKNOWN = "unknown"


def detect_database(url: str | None) -> DatabaseKind:
    """Classify a DATABASE_URL by its scheme prefix."""
    if not url:
        return DatabaseKind.UNKNOWN

    scheme = url.split("://", 1)[0].lower()

    match scheme:
        case "postgres" | "postgresql" | "postgresql+psycopg" | "postgresql+asyncpg":
            return DatabaseKind.POSTGRES
        case "sqlite" | "sqlite+aiosqlite":
            return DatabaseKind.SQLITE
        case _:
            return DatabaseKind.UNKNOWN


def normalize_database_url(url: str | None) -> str | None:
    """Rewrite driver-specific URLs to the driver this app actually uses."""
    kind = detect_database(url)

    match kind:
        case DatabaseKind.POSTGRES:
            # bare postgresql:// → postgresql+psycopg:// (psycopg3)
            assert url is not None
            if url.startswith(("postgresql://", "postgres://")):
                return url.replace("postgres://", "postgresql+psycopg://", 1) \
                          .replace("postgresql://", "postgresql+psycopg://", 1)
            return url
        case DatabaseKind.SQLITE:
            return url
        case _:
            return url


DATABASE_URL = normalize_database_url(os.getenv("DATABASE_URL"))
DATABASE_KIND = detect_database(DATABASE_URL)

# if DATABASE_URL and DATABASE_URL.startswith("postgresql://"):
#     DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)

JWT_SECRET = os.getenv("JWT_SECRET", "super-secret-key")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

PAYMONGO_SECRET_KEY = os.getenv("PAYMONGO_SECRET_KEY") or os.getenv("PAYMONGO_SK_TEST")
PAYMONGO_MODE = os.getenv("PAYMONGO_MODE", "test").lower()
PAYMONGO_API_BASE= os.getenv("PAYMONGO_API_BASE", "https://api.paymongo.com/v1")

PAYMONGO_RETURN_URL= os.getenv("PAYMONGO_RETURN_URL", "http://localhost:5173/dashboard/top-up")
PAYMONGO_WEBHOOK_SECRET = os.getenv("PAYMONGO_WEBHOOK_SECRET")

CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    if origin.strip()
    # "http://localhost:3000"
]

ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7


AUTH_COOKIE_OPTIONS = {
    "httponly": True,
    "secure": True,
    "samesite": "lax",
}


def validate_config():
    required = {
        "DATABASE_URL": DATABASE_URL,
        # "JWT_SECRET": JWT_SECRET,
        # "PAYMONGO_SECRET_KEY": PAYMONGO_SECRET_KEY,
        # "PAYMONGO_WEBHOOK_SECRET": PAYMONGO_WEBHOOK_SECRET,
    }
    if JWT_SECRET == "super-secret-key":
        print("WARNING: Using default JWT_SECRET")

    missing = []

    for name, value in required.items():
        if not value:
            missing.append(name)

    if missing:
        raise RuntimeError(
            "Missing required environment variables: "
            + ", ".join(missing)
        )

    expected_prefix = "sk_live_" if PAYMONGO_MODE == "live" else "sk_test_"
    if PAYMONGO_MODE not in {"test", "live"}:
        raise RuntimeError("PAYMONGO_MODE must be 'test' or 'live'")
    if not (PAYMONGO_SECRET_KEY or "").startswith(expected_prefix):
        raise RuntimeError(
            f"PAYMONGO_SECRET_KEY must start with {expected_prefix!r} for PAYMONGO_MODE={PAYMONGO_MODE!r}"
        )
