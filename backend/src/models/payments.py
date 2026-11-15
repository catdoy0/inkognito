from datetime import datetime, timezone

from sqlmodel import Field, SQLModel

from src.models.enums import PaymentProvider, PaymentStatus


class Payments(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)

    amount_centavos: int

    status: PaymentStatus = Field(default=PaymentStatus.PENDING, index=True)

    reference: str = Field(max_length=64, unique=True, index=True)
    client_request_key: str | None = Field(
        default=None, max_length=255, unique=True, index=True
    )

    provider: PaymentProvider = Field(default=PaymentProvider.PAYMONGO, nullable=True)

    provider_intent_id: str | None = Field(default=None, max_length=128, index=True)
    provider_payment_id: str | None = Field(default=None, max_length=128, index=True)
    provider_client_key: str | None = Field(default=None, max_length=128)
    provider_payment_method: str | None = Field(default=None, max_length=50)

    next_action_url: str | None = Field(default=None, max_length=512)

    receipt_number: str | None = Field(default=None, max_length=50, index=True)
    receipt_url: str | None = Field(default=None, max_length=512)

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime | None = None
    paid_at: datetime | None = None
