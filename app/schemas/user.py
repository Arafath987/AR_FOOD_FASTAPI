from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    username: str = Field(
        min_length=3,
        max_length=20,
        description="Username (3–20 chars, letters, numbers, underscore only)",
    )
    email: EmailStr = Field(description="Valid email address")
    designation: str = Field(
        min_length=5, max_length=20, description="User designation (5 to 20 characters)"
    )
    phone_number: str = Field(
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
                "username": "yaser_dev",
                "email": "yaser@gmail.com",
                "designation": "Backend Dev",
                "phone_number": "9876543210",
                "password": "StrongPass1",
            }
        }
    }
