from selenium import webdriver
from selenium.webdriver.common.by import By
import time

base_url = "http://localhost:3000/"
email_all_correct = "renterhost@gmail.com"
password_all_correct = "password"
password_not_correct = "wrongpassword"
email_wrong_format = "renter@gmail"
password_wrong_format = "pass"
email_not_present = "nonrenter@gmail.com"

def execute_login(email, password):
    driver = webdriver.Chrome()
    # Going to Home page
    driver.get(base_url)
    driver.maximize_window()
    time.sleep(2)
    # Going to Login page through navbar
    driver.find_element(By.ID, 'loginTab').click()
    time.sleep(2)
    # Inputting email and password into form and clicking submit
    driver.find_element(By.ID,'email').send_keys(email)
    driver.find_element(By.ID,'password').send_keys(password)
    driver.find_element(By.ID,'submitButton').click()
    time.sleep(3)
    # If email and password correct format and exists do this
    if (email == email_all_correct) and (password == password_all_correct):
        # Looks for welcome message on navbar and returns it
        welcome_element = driver.find_element(By.ID, 'welcomeMessage')
        welcome_message = welcome_element.text
        time.sleep(2)
        return welcome_message
    # Otherwise do this
    else:
        # Looks for error message in form and returns it
        error_element = driver.find_element(By.ID,'error_messages')  
        error_message = error_element.text
        time.sleep(2)
        return error_message

# Runs through all login scenarios and executes the test for each
# Asserts whether or not error message matches expected value
def test_login():
    welcome_message = execute_login(email_all_correct, password_all_correct)
    print(welcome_message)
    assert welcome_message == "Welcome, renter!"
    error_message = execute_login(email_all_correct, password_not_correct)
    print(error_message)
    assert error_message == "Wrong password"
    error_message = execute_login(email_wrong_format, password_all_correct)
    print(error_message)
    assert error_message == "Invalid email address."
    error_message = execute_login(email_all_correct, password_wrong_format)
    print(error_message)
    assert error_message == "Field must be between 8 and 20 characters long."
    error_message = execute_login(email_not_present, password_all_correct)
    print(error_message)
    assert error_message == "No user found"

try:
    test_login()
    print("All login tests passed!")
except AssertionError as e:
    print(f"Login test failed: {e}")
