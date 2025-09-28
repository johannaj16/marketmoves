from pydantic import BaseModel, PositiveInt
class User(BaseModel):
    email: str
    firstName: str
    lastName: str
    balance: float

class Order(BaseModel):
    stock: str
    quantity: PositiveInt 
    transaction: str            # buy or sell
