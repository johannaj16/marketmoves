from fastapi import APIRouter,FastAPI, Depends, HTTPException
from models import User
from sqlmodel import Session, select
from db import get_session

# auth_routes.py → login/signup/logout endpoints
router = APIRouter()

@router.get("/")
async def ping():
    return {"message": "user"}


@router.post("/")
def create_user(user: User, session: Session = Depends(get_session)):
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@router.get("/")
def get_all_users(session: Session = Depends(get_session)):
    try: 
        statement = select(User)
        allQueries = session.exec(statement).all()
    except Exception as e: 
        raise HTTPException(status_code=500, detail=f"Database session connection issue: {e}\n")
    return allQueries   # query using ORM model

@router.get("/{id}")
def get_user(id: int, session: Session = Depends(get_session)):

    if not session:
        raise HTTPException(status_code=500, detail='Database session connection issue\n')
    
    
    try: 
        statement = select(User).where(User.id==id)  # query using ORM model 
        user = session.exec(statement).first()
    except Exception as e: 
        raise HTTPException(status_code=500, detail=f"Database session connection issue: {e}\n")
    if not user:
        raise HTTPException(status_code=404, detail='User cannot be found\n')
        
    return user
