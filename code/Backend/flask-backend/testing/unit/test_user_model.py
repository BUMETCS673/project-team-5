from app import User

"""
GIVEN a User model
WHEN a new User is created
THEN check the id, email, password, and user_type fields are defined correctly
"""
def test_basic_user_model():
    id = 1
    email = "test@abc.com"
    password = "testPassword"
    user_type = "testType"
    user = User(id=id, email=email, password=password, user_type=user_type)
    assert user.id == id
    assert user.email == email
    assert user.password == password
    assert user_type == user_type
