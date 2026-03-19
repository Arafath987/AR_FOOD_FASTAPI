from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import models
from app.database import engine
from contextlib import asynccontextmanager
from sqlalchemy import text

from app.router import auth, items, orders, user, order_item_recent


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables and reset tables with schema changes
    async with engine.begin() as conn:
        # Disable foreign key checks
        await conn.execute(text("SET FOREIGN_KEY_CHECKS=0"))

        # Drop tables in correct order (dependent tables first)
        await conn.execute(text("DROP TABLE IF EXISTS order_items_recent"))
        await conn.execute(text("DROP TABLE IF EXISTS order_items"))
        await conn.execute(text("DROP TABLE IF EXISTS orders"))

        # Re-enable foreign key checks
        await conn.execute(text("SET FOREIGN_KEY_CHECKS=1"))

    # Create all tables with updated schema in separate transaction
    async with engine.begin() as conn:
        await conn.run_sync(models.Base.metadata.create_all)

    yield
    # Shutdown
    await engine.dispose()


app = FastAPI(lifespan=lifespan)

# Add CORS middleware for Frontend and Vendor Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Customer Frontend
        "http://localhost:3001",  # Vendor Frontend
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(items.router)
app.include_router(orders.router)
app.include_router(user.router)
app.include_router(order_item_recent.router)
