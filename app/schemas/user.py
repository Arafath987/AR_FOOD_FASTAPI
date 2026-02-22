from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    id: int = Field(gt=0, description="User ID must be a positive integer")
    username: str = Field(
        min_length=3,
        max_length=20,
        regex=r"^[a-zA-Z0-9_]+$",
        description="Username (3–20 chars, letters, numbers, underscore only)",
    )
    email: EmailStr = Field(description="Valid email address")
    designation: str = Field(
        min_length=5, max_length=20, description="User designation (5 to 20 characters)"
    )
    phone_number: str = Field(
        regex=r"^[6-9]\d{9}$",
        description="10-digit Indian phone number starting with 6–9",
    )
    password: str = Field(
        min_length=8,
        max_length=100,
        description="Password must be at least 8 characters",
    )

    model_config = {
        "json_schema_extra": {
            "example": {
                "id": 1,
                "username": "yaser_dev",
                "email": "yaser@gmail.com",
                "designation": "Backend Dev",
                "phone_number": "9876543210",
                "password": "StrongPass1",
            }
        }
    }
