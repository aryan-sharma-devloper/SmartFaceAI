from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


class AdminCreate(BaseModel):
    username: str
    full_name: str
    email: EmailStr
    password: str