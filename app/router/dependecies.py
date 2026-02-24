from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from starlette import status
from passlib.context import CryptContext
from datetime import datetime, timedelta

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = "337894f2ec0de69545df401858b1c2f8f49f2bf8cefb5b1960e92650cc0d53da"
ALGORITHM = "HS256"

oauth2_bearer = OAuth2PasswordBearer(tokenUrl="/auth/token")


def get_current_user(token: str = Depends(oauth2_bearer)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        user_id = payload.get("id")

        if username is None or user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate user",
            )

        return {"username": username, "id": user_id}

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate user",
        )
