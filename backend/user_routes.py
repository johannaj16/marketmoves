from fastapi import APIRouter,FastAPI, Depends, HTTPException, Header
from models import User
from db import supabase
from typing import Optional

router = APIRouter()

@router.get("/ping")
async def ping():
    return {"message": "user"}


@router.get("/allUsers")
def get_all_users():
    try: 
        response = supabase.table("User").select("*").execute()
        users = User(**response.data)
    except Exception as e: 
        raise HTTPException(status_code=500, detail=f"Database session connection issue: {e}\n")
    return users  


@router.get("/{id}")
def get_user(id: int):    
    try: 
        response = supabase.table("User").select("*").eq("id", id).execute()
        user = response.data
    except Exception as e: 
        raise HTTPException(status_code=500, detail=f"Database session connection issue: {e}\n")
    if not user:
        raise HTTPException(status_code=404, detail='User cannot be found\n')
        
    return user[0]


@router.delete("deleteUser/{id}")
def delete_user(id: int):
    try:
        response = supabase.table("User").delete().eq("id", id)
    except Exception as e: 
        raise HTTPException(status_code=500, detail=f"Database session connection issue: {e}\n")
        
@router.get("watchlist/")
def get_watchlist(x_demo_user: Optional[str] = Header(None)):
    try: 
        response = supabase.table("user_watchlist").select("symbol").eq("user_id", x_demo_user).execute()
        if response.data is not None: 
            symbols = [d["symbol"] for d in response.data]
        else: 
            raise HTTPException(status_code=400, detail=f"Table not found: {e}\n")
            
        if not x_demo_user:
            raise HTTPException(status_code=404, detail='User cannot be found\n')

    except Exception as e: 
        raise HTTPException(status_code=500, detail=f"Database session connection issue: {e}\n")
    
    return {"user_id": x_demo_user, "symbols": symbols}

@router.post("/watchlist/add")
def add_symbol(payload: dict, x_demo_user: Optional[str] = Header(None)):
    try: 
        symbol = payload.get("symbol").upper()
        
        supabase.table("user_watchlist").upsert({"user_id": x_demo_user, "symbol": symbol}, on_conflict="user_id,symbol", ignore_duplicates=True).execute()
        response = supabase.table("user_watchlist").select("symbol").eq("user_id", x_demo_user).execute()
        symbols = [d["symbol"] for d in response.data]
        
        if response.data is not None: 
            symbols = [d["symbol"] for d in response.data]
        else: 
            raise HTTPException(status_code=400, detail=f"Table not found: {e}\n")
            
        if not x_demo_user:
            raise HTTPException(status_code=404, detail='User cannot be found\n')

    except Exception as e: 
        raise HTTPException(status_code=500, detail=f"Database session connection issue: {e}\n")

    return {"user_id": x_demo_user, "symbols": symbols}

@router.post("/watchlist/remove")
def remove_symbol(payload: dict, x_demo_user: Optional[str] = Header(None)):
    try: 
        symbol = payload.get("symbol").upper()
        supabase.table("user_watchlist").delete().eq("user_id", x_demo_user).eq("symbol", symbol).execute()
        response = supabase.table("user_watchlist").select("symbol").eq("user_id", x_demo_user).execute()
        symbols = [d["symbol"] for d in response.data]

        if response.data is not None: 
            symbols = [d["symbol"] for d in response.data]
        else: 
            raise HTTPException(status_code=400, detail=f"Table not found: {e}\n")
            
        if not x_demo_user:
            raise HTTPException(status_code=404, detail='User cannot be found\n')

    except Exception as e: 
        raise HTTPException(status_code=500, detail=f"Database session connection issue: {e}\n")
    
    return {"user_id": x_demo_user, "symbols": symbols}
