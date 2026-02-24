from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.models.orders import oi_recent, order_items
from typing import Annotated
from app.database import get_db
from sqlalchemy.orm import Session, joinedload
from starlette import status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from app.models.user import Users
from .user import bcrypt_context
from jose import jwt, JWTError
from datetime import datetime, timedelta


router = APIRouter(prefix="/auth", tags=["Auth"])

secreat_key = "337894f2ec0de69545df401858b1c2f8f49f2bf8cefb5b1960e92650cc0d53da"
ALGORITHM = "HS256"
oauth2_bearer = OAuth2PasswordBearer(tokenUrl="token")


class Token(BaseModel):
    access_token: str
    token_type: str


db_dependency = Annotated[Session, Depends(get_db)]


def authenticate_user(username: str, password: str, db: db_dependency):
    user = db.query(Users).filter(Users.username == username).first()
    if not user:
        return False
    if not bcrypt_context.verify(password, user.hashed_password):
        return False
    return user


def create_access_token(username: str, user_id, expires_delta: timedelta):
    encode = {"sub": username, "id": user_id}
    expires = datetime.utcnow() + expires_delta
    encode.update({"exp": expires})
    return jwt.encode(encode, secreat_key, algorithm=ALGORITHM)


async def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]):  # decode
    try:
        payload = jwt.decode(token, secreat_key, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        userid: int = payload.get("id")
        if username is None or userid is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="could not validate user",
            )

        return {"username": username, "id": userid}
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="could not validate user"
        )


# ------------------- Api -------------


@router.post("/token", response_model=Token, status_code=status.HTTP_201_CREATED)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: db_dependency
):
    user = authenticate_user(form_data.username, form_data.password, db)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    token = create_access_token(user.username, user.id, timedelta(minutes=20))

    return {"access_token": token, "token_type": "bearer"}
