from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.services.auth_service import authenticate_admin
from app.auth.jwt_handler import create_access_token

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    admin = authenticate_admin(
        db=db,
        username=form_data.username,
        password=form_data.password,
    )

    if admin is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password",
        )

    access_token = create_access_token(
        data={
            "sub": admin.username,
            "admin_id": admin.id,
            "role": admin.role,
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }