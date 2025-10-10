from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv
import os

load_dotenv()

# Replace these with your Supabase credentials
DB_USER = "postgres"
DB_PASSWORD = os.getenv("VITE_SUPABASE_ANON_KEY") # change this to the password
DB_HOST = os.getenv("VITE_SUPABASE_URL")  # put in the username 
DB_NAME = "postgres"
DATABASE_URL = f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:5432/{DB_NAME}"


engine = create_engine(DATABASE_URL, echo=True) # echo is used for debug (it will log all of the SQL statements)

def init_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
        

