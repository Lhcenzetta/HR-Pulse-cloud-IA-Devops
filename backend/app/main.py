from fastapi import FastAPI, Depends,HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from database import engine, get_db, Base
from shcema import CreateUser, Checkuser,listcheck
from sqlalchemy.orm import Session
from models.user import User
from models.job_skills import JobOffer
from fastapi.security import HTTPAuthorizationCredentials,HTTPBearer
from datetime import datetime
from passlib.context import CryptContext
import joblib
from jose import jwt, JWTError
import os
import time
from dotenv import load_dotenv
import pandas as pd 
Base.metadata.create_all(bind=engine)

from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.sdk.resources import SERVICE_NAME, Resource
from azure.ai.textanalytics import TextAnalyticsClient
from azure.core.credentials import AzureKeyCredential

load_dotenv()

# OpenTelemetry Setup
resource = Resource(attributes={
    SERVICE_NAME: "backend-hr-pulse"
})
tracer_provider = TracerProvider(resource=resource)
otlp_exporter = OTLPSpanExporter(endpoint=os.getenv("OTEL_EXPORTER_OTLP_ENDPOINT", "http://jaeger:4317"), insecure=True)
tracer_provider.add_span_processor(BatchSpanProcessor(otlp_exporter))
trace.set_tracer_provider(tracer_provider)
tracer = trace.get_tracer(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FastAPIInstrumentor.instrument_app(app)

# Azure AI Client
endpoint = os.getenv("endpoint") or "https://placeholder-endpoint.api.cognitive.microsoft.com/"
key = os.getenv("api_key") or "placeholder_key"
ai_client = TextAnalyticsClient(endpoint=endpoint, credential=AzureKeyCredential(key))

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


@app.post("/Predict")
def get_predict(dict: listcheck , cre = Depends(verfiy_token)):
    test_data = pd.DataFrame({
        'rating': [dict.rating],
        'age': [dict.age],
        'size': [dict.size],
        'type_of_ownership': [dict.type_of_ownership],
        'industry': [dict.industry],
        'sector': [dict.sector]
        })
    predicted_salary = model.predict(test_data)
    return {f"Predicted Salary: {predicted_salary[0]}$"}

@app.get("/get_all_jobs_with_skills")
def job_skills(db : Session = Depends(get_db),cre = Depends(verfiy_token)):
    return db.query(JobOffer).filter().all()


@app.get("/jobs/search/")
def search_jobs(title: str, db: Session = Depends(get_db), cre = Depends(verfiy_token)):
    jobs = db.query(JobOffer).filter(JobOffer.job_title.ilike(f"%{title}%")).all()
    return jobs


@app.get("/jobs/{id}")
def get_job_id(id: int, db: Session = Depends(get_db),cre = Depends(verfiy_token)):
    job = db.query(JobOffer).filter(JobOffer.id == id).first()

    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Job id does not exist"
        )

    return job
@app.delete("/delete_user/{user_id}")
def delete_user(user_id :int , db:Session = Depends(get_db), cre = Depends(verfiy_token)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404 , detail="User not found")
    db.delete(user)
    db.commit()
    return {"detail" : "User deleted successfully"}


@app.post("/extract-skills")
def extract_skills(text: str, cre=Depends(verfiy_token)):
    with tracer.start_as_current_span("azure_ai_extraction") as span:
        span.set_attribute("azure.endpoint", endpoint)
        
        start_time = time.time()
        try:
            poller = ai_client.begin_extract_key_phrases([text])
            result = poller.result()
            
            skills = []
            for doc in result:
                if not doc.is_error:
                    skills.extend(doc.key_phrases)
            
            duration = (time.time() - start_time) * 1000
            span.set_attribute("azure.duration_ms", duration)
            
            return {"skills": skills, "duration_ms": duration}
        except Exception as e:
            span.record_exception(e)
            span.set_status(trace.Status(trace.StatusCode.ERROR))
            raise HTTPException(status_code=500, detail=str(e))




  