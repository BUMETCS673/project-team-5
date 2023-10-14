import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
import time

class TestGoogleLogin(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.get("http://localhost:3000/#/login")  # Assuming your React app is running locally on port 3000
        time.sleep(2)  # Allow time for the page to load
    
    def tearDown(self):
        self.driver.quit()

    def test_google_login(self):
        # Switch to Google Login iFrame
        self.driver.switch_to.frame(self.driver.find_element(By.TAG_NAME, "iframe"))
        
        # Select Google login button
        google_login_button = self.driver.find_element(By.XPATH, "//div[@role = 'button']")
    
        # Click the Google login button
        google_login_button.click()

        # Allow time for the pop-up to load
        time.sleep(2) 

        # Get to Google pop-up window handle
        google_window = self.driver.window_handles[1]

        # Swicth to Google window
        self.driver.switch_to.window(google_window)

        # Select email 
        email = self.driver.find_element(By.ID, "identifierId")
        email.send_keys("IamprettysurenoonehasthisgmailIDSaahil@gmail.com")
        time.sleep(4) 
        email.send_keys(Keys.ENTER)

        # Expect automation message
        time.sleep(2)
        self.driver.find_element(By.XPATH, "//span[text()='Try again']")
        

if __name__ == "__main__":
    unittest.main()
