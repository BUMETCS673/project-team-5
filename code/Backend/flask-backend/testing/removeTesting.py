from selenium import webdriver
import sys
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException, ElementClickInterceptedException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
import time
from loginTesting import login # Import the login function

# Initialize Chrome WebDriver
driver = webdriver.Chrome()

# Call the login function with your credentials
login(driver, 'hello123@gmail.com', 'helloworld')

account_button = driver.find_element(By.PARTIAL_LINK_TEXT, 'Account')
account_button.click()
profile_button = driver.find_element(By.PARTIAL_LINK_TEXT, 'Profile')
profile_button.click()
wait = WebDriverWait(driver, 10)
time.sleep(3)
remove_item = "remove-79"
try:
    remove_item_button = driver.find_element(By.NAME, remove_item)
    driver.execute_script("arguments[0].scrollIntoView(true);", remove_item_button)
    driver.execute_script("arguments[0].click();", remove_item_button)

except NoSuchElementException:
    print(f"Test Failed: '{remove_item}' was not found. Removal could not be completed.")
    driver.quit()
    sys.exit() 
except ElementClickInterceptedException:
    print(f"Test Failed: '{remove_item}' could not be clicked.")
    driver.quit()
    sys.exit() 
time.sleep(2)

remove2_item_button = wait.until(EC.presence_of_element_located((By.NAME, 'remove2')))
time.sleep(2)
driver.save_screenshot("./removeItemImages/removeSelectItemScreen.png")
try:
    remove2_item_button.click()
    wait.until(EC.staleness_of(remove_item_button))


except Exception as e:
    print("Test Failed: Removal was unsuccessful. Error:", str(e))
time.sleep(8)

try:
    remove_item_button_after = driver.find_element(By.NAME, remove_item)
    print(f"Test Failed: '{remove_item}' was not removed.")
except NoSuchElementException:
    print(f"Test Passed: '{remove_item}' was removed.")
except Exception as e:
    print("Test Failed: An error occurred:", str(e))

driver.save_screenshot("./removeItemImages/afterRemovalScreen.png")
driver.quit()