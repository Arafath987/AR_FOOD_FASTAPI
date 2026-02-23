from sqlalchemy.exc import IntegrityError
from app.models.user import Users
from app.schemas.user import UserBase, UserResponse
from fastapi import APIRouter, Depends, HTTPException
from typing import Annotated
from sqlalchemy.orm import Session
from starlette import status
from app.database import sessionlocal
from typing import List
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


@router.get(
    "/view_user", response_model=List[UserResponse], status_code=status.HTTP_200_OK
)
async def view_user(db: db_dependency):
    users = db.query(Users).all()
    return users


@router.delete("/delete_user/{username}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(username: str, db: db_dependency):
    user = db.query(Users).filter(Users.username == username).first()

    if not user:
        raise HTTPException(status_code=404, detail="Username not found")

    try:
        db.delete(user)
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal server error")


@router.put(
    "/update_user/{username}",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
)
async def update_user(
    username: str,
    db: db_dependency,
    update_user_request: UserBase,
):
    user = db.query(Users).filter(Users.username == username).first()

    if not user:
        raise HTTPException(status_code=404, detail="Username not found")

    user.username = update_user_request.username
    user.email = update_user_request.email
    user.designation = update_user_request.designation
    user.phone_number = update_user_request.phone_number
    user.hashed_password = bcrypt_context.hash(update_user_request.password)

    try:
        db.commit()
        db.refresh(user)
        return user

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
            detail="Internal server error",
        )
