import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch
import os

with patch.dict(os.environ, {"model_path": "dummy_model.joblib", "SECRET_KEY": "test_secret"}):
    with patch("joblib.load", return_value=MagicMock()):
        from main import app
        from database import get_db

client = TestClient(app)

@pytest.fixture
def db_session():
    mock = MagicMock()
    mock.query.return_value.filter.return_value.all.return_value = []
    mock.query.return_value.filter.return_value.first.return_value = None
    return mock

@pytest.fixture(autouse=True)
def override_db(db_session):
    app.dependency_overrides[get_db] = lambda: db_session
    yield
    app.dependency_overrides.clear()

def test_signup_success(db_session):
    # Ensure it returns None for existence check
    db_session.query.return_value.filter.return_value.first.return_value = None

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

def test_signup_already_exists(db_session):
    db_session.query.return_value.filter.return_value.first.return_value = MagicMock()

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

def test_login_success(db_session):
    mock_user = MagicMock()
    mock_user.username = "testuser"
    db_session.query.return_value.filter.return_value.first.return_value = mock_user

    with patch("main.verfiy_hash_passsword", return_value=True):
        response = client.post(
            "/login",
            json={"username": "testuser", "passwordhash": "testpass"}
        )
    
    assert response.status_code == 200
    assert "token" in response.json()

def test_get_jobs(db_session):
    # Test protected endpoint
    # Mock token verification
    with patch("main.decode_token", return_value={"username": "testuser"}):
        response = client.get(
            "/get_all_jobs_with_skills",
            headers={"Authorization": "Bearer fake-token"}
        )
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_predict_salary(db_session):
    # Mock token and model
    with patch("main.decode_token", return_value={"username": "testuser"}):
        with patch("main.model.predict", return_value=[150000.0]):
            response = client.post(
                "/Predict",
                json={
                    "rating": 4.5,
                    "age": 30,
                    "size": "Large",
                    "type_of_ownership": "Public",
                    "industry": "IT",
                    "sector": "Tech"
                },
                headers={"Authorization": "Bearer fake-token"}
            )
    assert response.status_code == 200
    assert "Predicted Salary: 150000.0$" in response.json()[0]
