import os
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import jwt

# auth_routes.py → login/signup/logout endpoints
router = APIRouter()
security = HTTPBearer()
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")  # ask johanna for SUPABASE_JWT_SECRET


@router.get("/login")
def ping():
    return {"message": "auth"}

@router.get("/")
def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
       payload = jwt.decode(token, SUPABASE_JWT_SECRET, algorithms=["HS256"])  
       return payload
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


@router.get("/protected")
def protected_route(user = Depends(verify_token)):
    return {"message": f"Welcome {user['email']}"}