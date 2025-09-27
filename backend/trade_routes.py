from fastapi import APIRouter

# trade_routes.py → buy/sell orders, portfolio
router = APIRouter()

@router.get("/order")
def ping():
    return {"message": "trade"}