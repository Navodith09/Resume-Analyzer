from .utils import get_db_handle
from django.contrib.auth.hashers import make_password, check_password
import uuid

class User:
    def __init__(self):
        self.db, self.client = get_db_handle()
        self.collection = self.db['users']

    def create_user(self, username, email, password):
        if self.collection.find_one({'username': username}):
            raise ValueError("Username already exists")
        
        hashed_password = make_password(password)
        user_data = {
            'username': username,
            'email': email,
            'password': hashed_password,
            'user_id': str(uuid.uuid4())
        }
        result = self.collection.insert_one(user_data)
        return str(result.inserted_id)

    def authenticate(self, username, password):
        user = self.collection.find_one({'username': username})
        if user and check_password(password, user['password']):
            return user
        return None

    def get_user_by_username(self, username):
        return self.collection.find_one({'username': username})

    def reset_password(self, username, new_password):
        user = self.collection.find_one({'username': username})
        if not user:
            raise ValueError("User not found")
        
        hashed_password = make_password(new_password)
        self.collection.update_one(
            {'username': username},
            {'$set': {'password': hashed_password}}
        )
        return True
