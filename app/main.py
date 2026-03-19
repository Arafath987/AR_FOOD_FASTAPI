from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import models
from app.database import engine
from contextlib import asynccontextmanager
from sqlalchemy import text

from app.router import auth, items, orders, user, order_item_recent


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables if they don't exist (don't drop existing ones)
    async with engine.begin() as conn:
        await conn.run_sync(models.Base.metadata.create_all)
    yield
    # Shutdown
    await engine.dispose()


app = FastAPI(lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(items.router)
app.include_router(orders.router)
app.include_router(user.router)
app.include_router(order_item_recent.router)
