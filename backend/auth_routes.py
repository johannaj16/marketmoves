from fastapi import APIRouter
import firebase_admin
from firebase_admin import auth, credentials

# auth_routes.py → login/signup/logout endpoints
router = APIRouter()


@router.get("/login")
def ping():
    return {"message": "auth"}

@router.get("/")
def verify_token(token: str):
    try:
        decoded = auth.verify_id_token(token)
        return decoded
    except Exception as e:
        print("Token verification rejected: ", e)
        return None
