from fastapi import APIRouter
from models import User

# auth_routes.py → login/signup/logout endpoints
router = APIRouter()

@router.get("/")
async def ping():
    return {"message": "user"}


@router.post("/")
def create_user(user: User):
    pass