from fastapi import APIRouter,FastAPI, Depends, HTTPException
from models import User
from db import supabase


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
    return users   # query using ORM model


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


@router.delete("/menu/deleteUser/{id}")
def delete_user(id: int):
    try:
        response = supabase.table("User").delete().eq("id", id)
    except Exception as e: 
        raise HTTPException(status_code=500, detail=f"Database session connection issue: {e}\n")
        
