from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.base import Base
from app.database.database import engine

# Import ALL models so SQLAlchemy knows about them
import app.models

from app.api.admin import router as admin_router
from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.faces import router as face_router
from app.api.dashboard import router as dashboard_router
# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Smart Face AI API"
)

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(admin_router)
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(face_router)
app.include_router(dashboard_router)

@app.get("/")
def root():
    return {
        "message": "Smart Face AI Backend Running"
    }