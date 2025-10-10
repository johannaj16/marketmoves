from pydantic import BaseModel, PositiveInt
from sqlmodel import SQLModel, Field

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True) # primary_key needs to be unique and will increment automatically 
    email: str
    firstName: str
    lastName: str
    balance: float = 10000.0  # default value 

class Order(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_ID: int = Field(foreign_key="user.id")
    stock: str
    quantity: PositiveInt 
    transaction: str            # buy or sell
