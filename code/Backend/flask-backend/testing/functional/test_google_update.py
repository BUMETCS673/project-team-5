import pytest
import requests
from app import app, db, User

#tokens and input for testing
user_email = "pytest@abc.com"
user_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJUZXN0IEdvb2dsZSIsImlhdCI6MTY5Njc0NDM4OSwiZXhwIjoxNzI4MjgwMzg5LCJhdWQiOiJ3d3cudGVzdC5jb20iLCJzdWIiOiJweXRlc3RAYWJjLmNvbSIsImdpdmVuX25hbWUiOiJQeVRlc3QiLCJmYW1pbHlfbmFtZSI6IlVzZXIiLCJlbWFpbCI6InB5dGVzdEBhYmMuY29tIn0.1hjTqE9Nh6nYPB9CBBfB2rT3hpf5NMgCV6gnYsEu2zs"

@pytest.fixture
def client():
    # Setup
    app.config['TESTING'] = True
    client = app.test_client()

    # Add test user to db
    with app.app_context():
        new_user = User(id=1, email=user_email, password="Google account, password not available", user_type="renter")
        db.session.add(new_user)
        db.session.commit()

    yield client

    # Tear down: remove test user from db 
    with app.app_context():
        User.query.filter_by(email=user_email).delete()
        db.session.commit()

# Tests for app.route /api/update-google
def test_google_update_options(client):
    response = client.options('/api/update-google')
    assert response.status_code == 200
    assert response.json["message"] == "Success"

def test_google_update_change_user_type(client):
    data = {
        "email": user_email,
        "type": "host"
    }
    response = client.post('/api/update-google', json=data)
    assert response.status_code == 201
    assert response.json["message"] == "User updated successfully"

    with app.app_context():
        assert User.query.filter_by(email=user_email, user_type="host").first()

def test_google_update_unregistered_user(client):
    data = {
        "email": "unregistered_" + user_email,
        "type": "host"
    }
    response = client.post('/api/update-google', json=data)
    assert response.status_code == 404
    assert response.json["error"] == "User not found"

def test_google_update_invalid_request_content(client):
    data = {
        "missing_email": user_email,
        "type": "invalid_user_type"
    }
    response = client.post('/api/update-google', json=data)
    assert response.status_code == 500
    assert "Error validating user" in response.json["error"]

def test_google_update_unsuported_request_method(client):
    response = client.get('/api/update-google')
    assert response.status_code == 405
