from fastapi import APIRouter

# market_routes.py → stock websocket outputs 
router = APIRouter()

@router.get("/")
async def ping():
    return {"message": "market"}