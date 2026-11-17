from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.body_limit import RequestBodyLimitMiddleware
from starlette.responses import JSONResponse

from src.config import CORS_ORIGINS, validate_config
from src.database import assert_database_ready, ensure_default_super_admin
from src.routes.auth import router as auth_router
# from src.routes.payments import router as payments_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    validate_config()
    if not assert_database_ready():
        raise RuntimeError("Database is not ready; apply migrations before startup")

    ensure_default_super_admin()

    print(f"""
        {app.title}
            """)
    yield
    print("closing...")


app = FastAPI(
    lifespan=lifespan,
    title="Inkognito API",
    description="API for the Inkognito self-service printing system.",
    version="0.1.0",
    docs_url="/docs",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    RequestBodyLimitMiddleware,
    max_body_size=10 * 1024 * 1024 # 10mb
)

app.include_router(auth_router, prefix="/auth")
# app.include_router(payments_router, prefix="/payments")


@app.get("/")
def root():
    return JSONResponse(status_code=200, content={"message" : "🗿"}) 

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "src.main:app",
        host="0.0.0.0",
        port=8080,
        reload=True,
    )

