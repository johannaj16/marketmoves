from fastapi import APIRouter,FastAPI, Depends
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
    statement = select(User)
    return session.exec(statement).all()   # query using ORM model

@router.get("/{id}")
def get_user(id: int, session: Session = Depends(get_session)):
    statement = select(User).where(User.id==id)  # query using ORM model 

    ## ALERT HANDLE WHEN THE STATEMENT RETURNS NULL SO IT DOESN'T CONFUSE THE FRONT END 
    return session.exec(statement).first()
