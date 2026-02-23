from sqlalchemy.exc import IntegrityError
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
# ----------DB Dependency-----------


def get_db():
    db = sessionlocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]


# ------------API----------
@router.post("/create_user", status_code=status.HTTP_201_CREATED)
async def create_user(db: db_dependency, create_user_request: UserBase):
    if not create_user_request:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Request body cannot be null",
        )
    create_user_model = Users(
        username=create_user_request.username,
        email=create_user_request.email,
        designation=create_user_request.designation,
        phone_number=create_user_request.phone_number,
        hashed_password=bcrypt_context.hash(create_user_request.password),
    )
    try:
        db.add(create_user_model)
        db.commit()
        db.refresh(create_user_model)
        return create_user_model

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username or email or phone number already exists",
        )

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server erro",
        )
