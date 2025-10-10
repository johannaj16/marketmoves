from pydantic import BaseModel, PositiveInt
from supabase_auth import Optional


class User(BaseModel):
    id: Optional[int] # primary_key needs to be unique and will increment automatically 
    email: str
    firstName: str
    lastName: str
    balance: float = 10000.0  # default value 

class Order(BaseModel):
    id: Optional[int]
    user_ID: int
    stock: str
    quantity: PositiveInt 
    transaction: str            # buy or sell
