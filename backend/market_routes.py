from fastapi import APIRouter

# market_routes.py → stock websocket outputs 
router = APIRouter()

@router.get("/")
def ping():
    return {"message": "market"}