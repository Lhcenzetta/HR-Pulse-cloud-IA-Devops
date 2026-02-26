from pydantic import BaseModel

class CreateUser(BaseModel):
    username : str
    passwordhash : str
    createdate : str

class Checkuser(BaseModel):
    username : str
    passwordhash : str

class listcheck(BaseModel):
    rating : float
    age: int
    size: str
    type_of_ownership: str
    industry: str
    sector: str
    class config:
        orm_mode = True