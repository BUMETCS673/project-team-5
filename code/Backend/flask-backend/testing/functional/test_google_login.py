import pytest
import requests
from app import app

# jwt tokens for testing
unregistered_user_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2OTY3Mzk2MDQsImV4cCI6MTcyODI3NTYwNCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsImdpdmVuX25hbWUiOiJ0ZXN0IiwiZmFtaWx5X25hbWUiOiJ1c2VyIiwiZW1haWwiOiJpbnZhbGlkLnVzZXJAZW1haWwuY29tIiwiUm9sZSI6WyJNYW5hZ2VyIiwiUHJvamVjdCBBZG1pbmlzdHJhdG9yIl19.8lZBVMDGwVD-hyeRE175PVclazPARJIqymDoazKFEmA"
registered_user_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2OTY3Mzk2MDQsImV4cCI6MTcyODI3NTYwNCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsImdpdmVuX25hbWUiOiJ2YWxpZF90ZXN0IiwiZmFtaWx5X25hbWUiOiJ1c2VyIiwiZW1haWwiOiJhYmNAZGVmLmNvbSIsIlJvbGUiOlsiTWFuYWdlciIsIlByb2plY3QgQWRtaW5pc3RyYXRvciJdfQ.tzp6tmLmDHiHWJIwGwukIEoRoNpfCAunMFjRlZwaW5o"


@pytest.fixture
def client():
    # Test set-up
    app.config['TESTING'] = True
    client = app.test_client()

    yield client

# Tests for app.route /api/login-google
def test_google_login_options(client):
    response = client.options('/api/login-google')
    assert response.status_code == 200
    assert response.json == {'message': 'Success'}

# Tests for registered user
def test_google_login_registered_user(client):
    data = {
        "googleData": {
            "credential": registered_user_token
        }
    }
    response = client.post('/api/login-google', json=data)
    assert response.status_code == 200
    assert response.json["message"] == "User validated successfully"
    assert response.json["name"] == "valid_test user"

# Tests for unregistered user
def test_google_login_unregistered_user(client):
    data = {
        "googleData": {
            "credential": unregistered_user_token
        }
    }
    response = client.post('/api/login-google', json=data)
    assert response.status_code == 404
    assert response.json["message"] == "Please register first"
    assert response.json["name"] == "test user"

# Tests for invalid request
def test_google_login_invalid_request(client):
    data = {
        "bad_request_format": {
            "invalid_credential": registered_user_token
        }
    }
    response = client.post('/api/login-google', json=data)
    assert response.status_code == 500
    assert "Error validating user" in response.json["error"]

def test_google_login_unsuported_request_method(client):
    response = client.get('/api/login-google')
    assert response.status_code == 405
