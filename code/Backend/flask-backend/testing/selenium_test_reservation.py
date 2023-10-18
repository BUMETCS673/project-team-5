from selenium import webdriver
from selenium.webdriver.common.by import By
import time

driver = webdriver.Chrome()

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

login(driver, 'reservation@bu.edu', 'reservation')

add_items_button = driver.find_element(By.PARTIAL_LINK_TEXT, 'Reservations')
add_items_button.click()

start_date_field = driver.find_element(By.NAME, 'start_date')
end_date_field = driver.find_element(By.NAME, 'end_date') 

start_date_field.send_keys('10/03/2023')
end_date_field.send_keys('10/04/2023')

time.sleep(2)
driver.save_screenshot("./reservationImages/reservation.png")
submit_button = driver.find_element(By.ID, 'submitButton')
submit_button.click()

time.sleep(5)
# failing test case (incorrect success_message)
# success_message = "Reservation made!"
# make failing test case pass with correct success_message
success_message = "Your reservation has been made!"

if success_message in driver.page_source:
    print("Test Passed: " + success_message)
else:
    error_message = "Test Failed: Reservation not added"
    
    current_url = driver.current_url
    
    error_message += f"\n\nFailure Message: {error_message}\n"
    error_message += f"\nContext:"
    error_message += f"\n- Current URL: {current_url}"

    print(error_message)

driver.quit()