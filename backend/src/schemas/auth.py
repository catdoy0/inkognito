from email_validator import EmailNotValidError, validate_email
from pydantic import BaseModel, EmailStr, Field, field_validator


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class SignUpRequest(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    email: EmailStr
    password: str
    confirm_password: str

    @field_validator("email")
    @classmethod
    def email_must_be_deliverable(cls, value: str) -> str:
        try:
            result = validate_email(value, check_deliverability=False)
        except EmailNotValidError as exc:
            raise ValueError(str(exc)) from exc

        return result.normalized

class CheckEmailRequest(BaseModel):
    email: EmailStr

class GoogleSignInRequest(BaseModel):
    credential: str = Field(min_length=100)
