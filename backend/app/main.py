from fastapi import FastAPI
from database import engine, get_db, Base

# Base.metadata.create_all(engine)

app = FastAPI()


@app.get("/hi")
def hell():
    return "hello"