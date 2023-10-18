from selenium import webdriver
from selenium.webdriver.common.by import By
import time
from loginTesting import login


driver = webdriver.Chrome()

login(driver, 'hello123@gmail.com', 'helloworld')

account_button = driver.find_element(By.PARTIAL_LINK_TEXT, 'Account')
account_button.click()
profile_button = driver.find_element(By.PARTIAL_LINK_TEXT, 'Profile')
profile_button.click()
add_button = driver.find_element(By.ID, 'addButton')
add_button.click()
time.sleep(2)
driver.save_screenshot("./addItemImages/ProfilePage.png")

name_field = driver.find_element(By.NAME, 'name')
status_field = driver.find_element(By.NAME, 'status') 
price_field = driver.find_element(By.NAME, 'price')
description_field = driver.find_element(By.NAME, 'info')
name_field.send_keys('Item Name')
status_field.send_keys('Item Status')
price_field.send_keys('100')
description_field.send_keys('This is the description')
time.sleep(2)

submit_button = driver.find_element(By.ID, 'submitButton')
submit_button.click()

time.sleep(2)

success_message = "This is the description"
if success_message in driver.page_source:
    print("Test Passed: " + success_message)
else:
    error_message = "Test Failed: Item Name not added"
    
    current_url = driver.current_url
    form_fields = {
        "Name": "Item Name",
        "Status": "Item Status",
        "Price": "100",
        "Description": "This is the description",
    }
    
    error_message += f"\n\nFailure Message: {error_message}\n"
    error_message += f"\nContext:"
    error_message += f"\n- Current URL: {current_url}"
    error_message += f"\n- Form fields: {form_fields}"
    
    print(error_message)

driver.save_screenshot("./addItemImages/ViewItemScreen.png")
driver.quit()