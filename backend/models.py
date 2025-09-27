from pydantic import BaseModel, PositiveInt, PositiveFloat

class User(BaseModel):
    email: str
    firstName: str
    lastName: str
    balance: float
