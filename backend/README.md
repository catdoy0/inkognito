## REQUIREMENTS
- python
- uv

```sh
uv venv --python 3.14.7

source .venv/bin/activate # Linux (Bash)
.venv\Scripts\activate # Windows (PowerShell)

uv sync

alembic upgrade head

uv run python -m src.main
```

.env:
```sh
DATABASE_URL=

JWT_SECRET=super-secret-key

GOOGLE_CLIENT_ID=

PAYMONGO_SK_TEST=
PAYMONGO_PK_TEST=
PAYMONGO_API_BASE=https://api.paymongo.com/v1

PAYMONGO_RETURN_URL=
PAYMONGO_WEBHOOK_SECRET=

PAYMONGO_MODE=test

CORS_ORIGINS=
```
