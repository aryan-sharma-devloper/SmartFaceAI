from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.user import User
from app.auth.dependencies import get_current_admin
from app.schemas.user import UserCreate, UserUpdate

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


# ==========================
# GET ALL USERS
# ==========================
@router.get("")
def get_users(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    users = (
        db.query(User)
        .filter(User.is_deleted == False)
        .all()
    )

    return users
# ==========================
# GET SINGLE USER
# ==========================
@router.get("/{user_id}")
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    return user
# ==========================
# UPDATE USER
# ==========================
@router.put("/{user_id}")
def update_user(
    user_id: int,
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    user.employee_id = user_data.employee_id
    user.full_name = user_data.full_name
    user.email = user_data.email
    user.department = user_data.department
    user.phone = user_data.phone

    db.commit()
    db.refresh(user)

    return {
        "message": "User updated successfully",
        "user": user,
    }


# ==========================
# ADD USER
# ==========================
@router.post("")
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):

    existing = (
        db.query(User)
        .filter(User.employee_id == user.employee_id)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Employee ID already exists."
        )

    new_user = User(
        employee_id=user.employee_id,
        full_name=user.full_name,
        email=user.email,
        department=user.department,
        phone=user.phone,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User created successfully",
        "user": new_user,
    }


# ==========================
# DELETE USER
# ==========================
@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    user.is_deleted = True

    db.commit()

    return {
        "message": "User deleted successfully"
    }