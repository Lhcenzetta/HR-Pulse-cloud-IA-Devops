from pydantic import BaseModel

class CreateUser(BaseModel):
    username : str
    passwordhash : str
    createdate : str

class Checkuser(BaseModel):
    username : str
    passwordhash : str

    class config:
        orm_mode = True