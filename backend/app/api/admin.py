from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.auth import AdminCreate
from app.services.admin_service import create_admin
from app.auth.dependencies import get_current_admin

from app.models.admin import Admin

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
@router.get("")
def get_admins(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    admins = db.query(Admin).order_by(Admin.id).all()
    return admins
@router.delete("/{admin_id}")
def delete_admin(
    admin_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    admin = (
        db.query(Admin)
        .filter(Admin.id == admin_id)
        .first()
    )

    if not admin:
        raise HTTPException(
            status_code=404,
            detail="Admin not found",
        )

    # Prevent deleting yourself
    if admin.id == current_admin.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot delete your own account.",
        )

    db.delete(admin)
    db.commit()

    return {
        "message": "Admin deleted successfully"
    }