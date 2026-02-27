import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch
import os

# Set dummy environment variables before importing app
with patch.dict(os.environ, {"model_path": "dummy_model.joblib", "SECRET_KEY": "test_secret"}):
    # We need to mock joblib.load before it's called during module import
    with patch("joblib.load", return_value=MagicMock()):
        from backend.app.main import app
client = TestClient(app)

@pytest.fixture
def mock_db():
    with patch("main.get_db") as mock:
        yield mock

def test_signup_success(mock_db):
    # Mock db.query(...).first() to return None (user doesn't exist)
    db_session = MagicMock()
    db_session.query.return_value.filter.return_value.first.return_value = None
    mock_db.return_value = db_session

    response = client.post(
        "/Signup",
        json={
            "username": "testuser",
            "passwordhash": "testpass",
            "createdate": "2024-01-01"
        }
    )
    assert response.status_code == 200
    assert "Successfully Registred !!!" in response.json()

def test_signup_already_exists(mock_db):
    # Mock db.query(...).first() to return an existing user
    db_session = MagicMock()
    db_session.query.return_value.filter.return_value.first.return_value = MagicMock()
    mock_db.return_value = db_session

    response = client.post(
        "/Signup",
        json={
            "username": "testuser",
            "passwordhash": "testpass",
            "createdate": "2024-01-01"
        }
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "THIS USER ALERADY EXIST"

def test_login_success(mock_db):
    # Mock existing user with matching password
    db_session = MagicMock()
    mock_user = MagicMock()
    mock_user.username = "testuser"
    # Note: passwordhash in DB would be hashed, but we'll mock verify_hash_password too if needed or just mock the flow
    db_session.query.return_value.filter.return_value.first.return_value = mock_user
    mock_db.return_value = db_session

    with patch("main.verfiy_hash_passsword", return_value=True):
        response = client.post(
            "/login",
            json={"username": "testuser", "passwordhash": "testpass"}
        )
    
    assert response.status_code == 200
    assert "token" in response.json()
    assert response.json()["token_type"] == "bearer"

def test_login_invalid_password(mock_db):
    db_session = MagicMock()
    db_session.query.return_value.filter.return_value.first.return_value = MagicMock()
    mock_db.return_value = db_session

    with patch("main.verfiy_hash_passsword", return_value=False):
        response = client.post(
            "/login",
            json={"username": "testuser", "passwordhash": "wrongpass"}
        )
    
    assert response.status_code == 400
    assert response.json()["detail"] == "Password invalid"
