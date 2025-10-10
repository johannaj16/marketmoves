from sqlmodel import SQLModel, create_engine, Session
from supabase import create_client, Client
from dotenv import load_dotenv
import os

load_dotenv()

# Replace these with your Supabase credentials
DB_PASSWORD = os.getenv("VITE_SUPABASE_ANON_KEY") # change this to the password
DATABASE_URL = os.getenv("VITE_SUPABASE_URL")


supabase: Client = create_client(DATABASE_URL, DB_PASSWORD)



