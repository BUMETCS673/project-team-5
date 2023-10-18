from selenium import webdriver
from selenium.webdriver.common.by import By
import time

# Define the base URL of your application
base_url = "http://localhost:3000/"  # Change the port if needed


# Function to perform a search for items
def test_search_items(search_query):
    driver = webdriver.Chrome()
    driver.get(base_url)
    # Logging into the application
    driver.get(base_url)  # Replace with your app's URL
    driver.find_element(By.ID,'collapsible-nav-dropdown').click()
    time.sleep(2)
    driver.find_element(By.ID,'login').click()
    time.sleep(2)
    driver.find_element(By.ID,'email').send_keys("lazpz61@gmail.com")
    driver.find_element(By.ID,'password').send_keys("testing1")
    driver.find_element(By.ID,'submitButton').click()
    time.sleep(3)

    search_input = driver.find_element(By.ID,'searchInput')
    search_button = driver.find_element(By.ID,'searchButton')
    time.sleep(4)
    # Enter the search query and submit the form
    search_input.send_keys(search_query)
    search_button.click()
    # Wait for the results to load 
    time.sleep(2)
    search_input.clear()
    print("Finished Search Items Test for word:" + search_query)

# # Function to test searching for available items
def test_search_available_items():
    driver = webdriver.Chrome()
    driver.get(base_url)
    # Logging into the application
    driver.get(base_url)  # Replace with your app's URL
    driver.find_element(By.ID,'collapsible-nav-dropdown').click()
    time.sleep(2)
    driver.find_element(By.ID,'login').click()
    time.sleep(2)
    driver.find_element(By.ID,'email').send_keys("lazpz61@gmail.com")
    driver.find_element(By.ID,'password').send_keys("testing1")
    driver.find_element(By.ID,'submitButton').click()
    time.sleep(3)

    driver.find_element(By.ID,"radioAvailable").click()
    search_button = driver.find_element(By.ID,'searchButton')
    search_button.click()
    print("Finished Available Test")
    

# # Function to test searching for unavailable items
def test_search_unavailable_items():
    driver = webdriver.Chrome()
    driver.get(base_url)
    # Logging into the application
    driver.get(base_url)  # Replace with your app's URL
    driver.find_element(By.ID,'collapsible-nav-dropdown').click()
    time.sleep(2)
    driver.find_element(By.ID,'login').click()
    time.sleep(2)
    driver.find_element(By.ID,'email').send_keys("lazpz61@gmail.com")
    driver.find_element(By.ID,'password').send_keys("testing1")
    driver.find_element(By.ID,'submitButton').click()
    time.sleep(3)

    driver.find_element(By.ID,"radioUnavailable").click()
    search_button = driver.find_element(By.ID,'searchButton')
    search_button.click()
    print("Finished Unavailable Test")

# Function to test searching for all items
def test_search_all_items():
    test_search_items("Tent")
    test_search_items("Boots")
    test_search_items("Canoe")
    test_search_items("Bike")
    test_search_items("Boat")
    test_search_items("Roller Blades")
    test_search_items("Surf Board")

# Run the tests
try:
    test_search_available_items()
    test_search_unavailable_items()
    test_search_all_items()
    print("All search tests passed!")
except AssertionError as e:
    print(f"Search test failed: {e}")