from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.auth import AdminCreate
from app.services.admin_service import create_admin
from app.auth.dependencies import get_current_admin

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


@router.post("/create")
def create_admin_api(
    request: AdminCreate,
    db: Session = Depends(get_db),
):
    admin = create_admin(
        db=db,
        username=request.username,
        full_name=request.full_name,
        email=request.email,
        password=request.password,
    )

    if admin is None:
        return {"message": "Admin already exists"}

    return {"message": "Admin created successfully"}


@router.get("/me")
def get_current_admin_profile(
    current_admin=Depends(get_current_admin),
):
    return {
        "id": current_admin.id,
        "username": current_admin.username,
        "full_name": current_admin.full_name,
        "email": current_admin.email,
        "role": current_admin.role,
    }