from fastapi import FastAPI, Depends,HTTPException, status
from database import engine, get_db, Base
from shcema import CreateUser, Checkuser
from sqlalchemy.orm import Session
from models.user import User
from fastapi.security import HTTPAuthorizationCredentials,HTTPBearer
from datetime import datetime
from passlib.context import CryptContext
import joblib
from jose import jwt, JWTError
import os
import time
from dotenv import load_dotenv

Base.metadata.create_all(bind=engine)

app = FastAPI()

load_dotenv()
model_path  = os.getenv("model_path")
model = joblib.load(model_path)
algorithme = "HS256"
SECRET_KEY  = os.getenv("SECRET_KEY")
barear_chema = HTTPBearer()

pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto"
)

def create_hash_mode_pass(password):
    return pwd_context.hash(password)

def verfiy_hash_passsword(new_password , hashed_password):
    return pwd_context.verify(new_password, hashed_password)

def create_token(paylod):
    return jwt.encode(paylod, SECRET_KEY , algorithm=algorithme)

def decode_token(token):
    return jwt.decode(token , SECRET_KEY , algorithms=algorithme)

def verfiy_token(cre: HTTPAuthorizationCredentials = Depends(barear_chema)):
    token = cre.credentials
    decode = decode_token(token)
    if decode is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='this toke is invalide'
        )
    return decode
        

@app.post("/Signup")
def home(user : CreateUser , db : Session = Depends(get_db)):
    exist_user = db.query(User).filter(user.username == User.username).first()
    if exist_user:
        raise  HTTPException(status_code=400, detail="THIS USER ALERADY EXIST")
    else:
        new_user = User(
            username  = user.username,
            passwordhash = create_hash_mode_pass(user.passwordhash),
            createdate = datetime.utcnow()
         )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"Successfully Registred !!!"}


@app.post("/login")
def login(user: Checkuser , db:Session = Depends(get_db)):
    exit_user = db.query(User).filter(user.username == User.username).first()
    if not exit_user:
        raise HTTPException(status_code=400 , detail="This user doesn't exist ! please login")
    if not verfiy_hash_passsword(user.passwordhash,exit_user.passwordhash):
        raise HTTPException(status_code=400 , detail="Password invalid")
    
    paylod = {"username":user.username }
    token  = create_token(paylod)
    return{"token" : token , "token_type" : "bearer"}



@app.delete("/delete_user/{user_id}")
def delete_user(user_id :int , db:Session = Depends(get_db), cre = Depends(verfiy_token)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404 , detail="User not found")
    db.delete(user)
    db.commit()
    return {"detail" : "User deleted successfully"}


@app.post("/Predict")
def get_predict():
    return {"ji"}



  