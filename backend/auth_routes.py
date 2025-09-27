from fastapi import APIRouter

# auth_routes.py → login/signup/logout endpoints
router = APIRouter()

@router.get("/login")
def ping():
    return {"message": "auth"}