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

import random
import datetime

class OTP:
    def __init__(self):
        self.db, self.client = get_db_handle()
        self.collection = self.db['otps']

    def create_otp(self, email, reason='reset_password'):
        # Invalidate existing active OTPs for this email and reason
        self.collection.update_many(
            {'email': email, 'reason': reason, 'is_active': True},
            {'$set': {'is_active': False}}
        )

        otp_code = str(random.randint(100000, 999999))
        otp_data = {
            'email': email,
            'otp': otp_code,
            'reason': reason,
            'is_active': True,
            'created_at': datetime.datetime.utcnow()
        }
        self.collection.insert_one(otp_data)
        return otp_code

    def verify_otp(self, email, otp, reason='reset_password'):
        # Find active OTP
        otp_record = self.collection.find_one({
            'email': email,
            'reason': reason,
            'is_active': True,
            'otp': otp
        })

        if not otp_record:
            return False

        # Check expiration (10 minutes)
        if datetime.datetime.utcnow() - otp_record['created_at'] > datetime.timedelta(minutes=10):
            # Deactivate if expired
            self.collection.update_one({'_id': otp_record['_id']}, {'$set': {'is_active': False}})
            return False

        # Deactivate used OTP
        self.collection.update_one({'_id': otp_record['_id']}, {'$set': {'is_active': False}})
        return True
