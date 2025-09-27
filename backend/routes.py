from fastapi import APIRouter

# routes.py → health checks, misc endpoints
router = APIRouter()

@router.get("/")
def ping():
    return {"message": "health"}
