from app.models.user import Users
from app.schemas.user import UserBase
from fastapi import APIRouter, Depends, Path, HTTPException
from typing import Annotated
from sqlalchemy.orm import Session, joinedload
from starlette import status
from app.database import sessionlocal
from passlib.context import CryptContext

router = APIRouter(prefix="/User", tags=["User"])
bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# -------------------- DB Dependency --------------------


def get_db():
    db = sessionlocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]


@router.post("/auth", status_code=status.HTTP_201_CREATED)
async def create_user(db: db_dependency, create_user_request: UserBase):
    create_user_model = Users(
        username=create_user_request.username,
        email=create_user_request.email,
        designation=create_user_request.designation,
        phone_number=create_user_request.phone_number,
        hashed_password=bcrypt_context.hash(create_user_request.password),
    )
    db.add(create_user_model)
    db.commit()
    return create_user_model
