import requests
import json

BASE_URL = 'http://localhost:8000/auth'

def test_auth():
    # 1. Register
    print("Testing Registration...")
    register_data = {
        'username': 'testuser_mongo',
        'email': 'test@example.com',
        'password': 'password123'
    }
    response = requests.post(f'{BASE_URL}/register/', json=register_data)
    print(f"Register Response: {response.status_code} - {response.text}")

    # 2. Signin
    print("\nTesting Signin...")
    signin_data = {
        'username': 'testuser_mongo',
        'password': 'password123'
    }
    session = requests.Session()
    response = session.post(f'{BASE_URL}/signin/', json=signin_data)
    print(f"Signin Response: {response.status_code} - {response.text}")
    
    # 3. Signout
    print("\nTesting Signout...")
    response = session.post(f'{BASE_URL}/signout/')
    print(f"Signout Response: {response.status_code} - {response.text}")

    # 4. Reset Password
    print("\nTesting Reset Password...")
    reset_data = {
        'username': 'testuser_mongo',
        'new_password': 'newpassword123'
    }
    response = requests.post(f'{BASE_URL}/reset-password/', json=reset_data)
    print(f"Reset Password Response: {response.status_code} - {response.text}")

    # 5. Signin with new password
    print("\nTesting Signin with New Password...")
    signin_data['password'] = 'newpassword123'
    response = session.post(f'{BASE_URL}/signin/', json=signin_data)
    print(f"Signin (New Pass) Response: {response.status_code} - {response.text}")

if __name__ == '__main__':
    test_auth()
