import pytest
import requests
from app import app, db, User

# jwt tokens for testing
unregistered_user_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2OTY3Mzk2MDQsImV4cCI6MTcyODI3NTYwNCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsImdpdmVuX25hbWUiOiJ0ZXN0IiwiZmFtaWx5X25hbWUiOiJ1c2VyIiwiZW1haWwiOiJpbnZhbGlkLnVzZXJAZW1haWwuY29tIiwiUm9sZSI6WyJNYW5hZ2VyIiwiUHJvamVjdCBBZG1pbmlzdHJhdG9yIl19.8lZBVMDGwVD-hyeRE175PVclazPARJIqymDoazKFEmA"
registered_user_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2OTY3Mzk2MDQsImV4cCI6MTcyODI3NTYwNCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsImdpdmVuX25hbWUiOiJ2YWxpZF90ZXN0IiwiZmFtaWx5X25hbWUiOiJ1c2VyIiwiZW1haWwiOiJhYmNAZGVmLmNvbSIsIlJvbGUiOlsiTWFuYWdlciIsIlByb2plY3QgQWRtaW5pc3RyYXRvciJdfQ.tzp6tmLmDHiHWJIwGwukIEoRoNpfCAunMFjRlZwaW5o"
long_email_user_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJUZXN0IEdvb2dsZSIsImlhdCI6MTY5Njc0NDM4OSwiZXhwIjoxNzI4MjgwMzg5LCJhdWQiOiJ3d3cudGVzdC5jb20iLCJzdWIiOiJweXRlc3RAYWJjLmNvbSIsImdpdmVuX25hbWUiOiJMb25nRW1haWwiLCJmYW1pbHlfbmFtZSI6IlVzZXIiLCJlbWFpbCI6IjI1Nl8xMjM0NTY3ODkwMTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MEBhYmNkZWZnaGlqYWJjZGVmZ2hpamFiY2RlZmdoaWphYmNkZWZnaGlqYWJjZGVmZ2hpamFiY2RlZmdoaWphYmNkZWZnaGlqYWJjZGVmZ2hpai56eXd2dXRzcnFwenl3dnV0c3JxcHp5d3Z1dHNycXB6eXd2dXRzcnFwenl3dnV0c3JxcHp5d3Z1dHNycXB6eXd2dXRzcnFwenl3dnV0c3JxcHp5d3Z1dHNycXAifQ.DbesVGI0GMbUPtXz1j2ltIgMIIaGyAJG2uWPX0F04mQ"

@pytest.fixture
def client():
    app.config['TESTING'] = True
    client = app.test_client()

    yield client

# Tests for app.route /api/register-google
def test_google_register_options(client):
    # Test set-up
    response = client.options('/api/register-google')
    assert response.status_code == 200
    assert response.json["message"] == "Success"

# Tests for registered user
def test_google_register_registered_user(client):
    data = {
        "googleData": {
            "credential": registered_user_token
        }
    }
    response = client.post('/api/register-google', json=data)
    assert response.status_code == 200
    assert response.json["message"] == "User validated successfully"
    assert response.json["name"] == "valid_test user"
    assert response.json["isNew"] == False
    assert response.json["email"] == "abc@def.com"

# Tests for unregistered user
def test_google_register_unregistered_user(client):
    user_email = "invalid.user@email.com"
    data = {
        "googleData": {
            "credential": unregistered_user_token
        }
    }
    response = client.post('/api/register-google', json=data)
    assert response.status_code == 201
    assert response.json["message"] == "User added successfully"
    assert response.json["name"] == "test user"
    assert response.json["isNew"] == True
    assert response.json["email"] == user_email
    
    with app.app_context():
        assert User.query.filter_by(email=user_email).first()
        User.query.filter_by(email=user_email).delete()
        db.session.commit()

# Tests for invalid credential request
def test_google_register_invalid_request_credential(client):        
    data = {
        "googleData": {
            "invalid_credential": registered_user_token
        }
    }
    response = client.post('/api/register-google', json=data)
    assert response.status_code == 500
    assert "Error validating user" in response.json["error"]

# Tests for invalid google data request
def test_google_register_invalid_request_googledata(client):        
    data = {
        "bad_request_format": {
            "credential": registered_user_token
        }
    }
    response = client.post('/api/register-google', json=data)
    assert response.status_code == 500
    assert "Error validating user" in response.json["error"]

# Tests for long email
def test_google_register_long_email_request(client):        
    data = {
        "googleData": {
            "credential": long_email_user_token
        }
    }
    response = client.post('/api/register-google', json=data)
    assert response.status_code == 500
    assert "value too long for type character varying(255)" in response.json["error"]

def test_google_register_unsuported_request_method(client):
    response = client.get('/api/register-google')
    assert response.status_code == 405
