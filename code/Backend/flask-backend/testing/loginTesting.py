from selenium.webdriver.common.by import By
import time

def login(driver, email, password):
    driver.get('http://127.0.0.1:3000/#/login')
    time.sleep(2)
    email_field = driver.find_element(By.NAME, 'email')
    password_field = driver.find_element(By.NAME, 'password')

    email_field.send_keys(email)
    password_field.send_keys(password)

    login_button = driver.find_element(By.ID, 'submitButton')
    login_button.click()

    time.sleep(2)