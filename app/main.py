from fastapi import FastAPI
from app import models
from app.database import engine

from app.router import auth, items, orders, user

app = FastAPI()
models.Base.metadata.create_all(bind=engine)


app.include_router(auth.router)
app.include_router(items.router)
app.include_router(orders.router)
app.include_router(user.router)
