from sqlalchemy import Column, Integer, String


class User:
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String)
    passwordhash = Column(String)
    createdate = Column(String)