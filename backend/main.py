from fastapi import FastAPI
import auth_routes, routes, trade_routes, market_routes

app = FastAPI()

# router is a mini-FastAPI app that holds its own endpoints
# Without routers, all endpoints go into main.py which is messy
app.include_router(routes.router)
app.include_router(auth_routes.router, prefix="/auth")
app.include_router(trade_routes.router, prefix="/trade")
app.include_router(market_routes.router, prefix="/market")

@app.get("/")
async def root():
    return {"message": "Hello World"}