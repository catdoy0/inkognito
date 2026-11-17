from datetime import datetime, timezone

from sqlmodel import Column, Field, Integer, SQLModel, text

from src.models.enums import UserRole


class Users(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)

    first_name: str | None = Field(default=None, max_length=50)
    last_name: str | None = Field(default=None, max_length=50)
    email: str = Field(max_length=255, unique=True, index=True)

    password_hash: str | None = Field(max_length=255, nullable=True)
    oauth_provider: str | None = Field(default=None, max_length=50)
    oauth_id: str | None = Field(default=None, max_length=500)
    avatar_url: str | None = Field(default=None, max_length=500)

    role: UserRole = Field(default=UserRole.USER)
    is_active: bool = Field(default=True)

    credits_centavos: int = Field(
        default=0,
        ge=0,
        sa_column=Column(Integer, nullable=False, server_default=text("0")),
    )

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    updated_at: datetime | None = None
    last_sign_in: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# probably better if oauth stuff is separated so users can associate multiple oauth to a single account
#
# users
#   id, email, password_hash, role, ...
#
# oauth_accounts
#   id
#   user_id           FK → users.id  (ON DELETE CASCADE)
#   provider          "google" | "facebook" | "github" | ...
#   provider_user_id  the provider's sub / id
#   email             provider's email (may differ from users.email)
#   avatar_url        provider's picture
#   created_at
#   last_sign_in
