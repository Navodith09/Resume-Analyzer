from pymongo import MongoClient
from pymongo.server_api import ServerApi
from django.conf import settings

def get_db_handle():
    client = MongoClient(settings.MONGO_URI, server_api=ServerApi('1'))
    db = client[settings.MONGO_DB_NAME]
    return db, client
