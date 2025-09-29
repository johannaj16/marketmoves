from fastapi import Depends, FastAPI, HTTPException
import auth_routes, routes, trade_routes, market_routes, user_routes
from models import User
from fastapi.security import HTTPBearer
# from firebase_auth import verify_token

app = FastAPI()
security = HTTPBearer()

# router is a mini-FastAPI app that holds its own endpoints
# Without routers, all endpoints go into main.py which is messy
app.include_router(routes.router)
app.include_router(auth_routes.router, prefix="/auth")
app.include_router(trade_routes.router, prefix="/trade")
app.include_router(market_routes.router, prefix="/market")
app.include_router(user_routes.router, prefix="/user")

@app.get("/protected")
async def authenticated(credentials: HTTPBearer = Depends(security)):
    token = credentials.credentials
    decoded = auth_routes.verify_token(token)
    if not decoded:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    