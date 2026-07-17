from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str
    phone: str | None = None


class UserUpdate(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str
    phone: str | None = None


class UserResponse(BaseModel):
    id: int
    employee_id: str
    full_name: str
    email: str
    department: str
    phone: str | None = None

    model_config = {
        "from_attributes": True
    }