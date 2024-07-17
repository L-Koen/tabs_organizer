import pytest
import os
from django.contrib.auth.models import User
from django.conf import settings
from dotenv import load_dotenv

# Load credentials variables from .env file
load_dotenv()

@pytest.fixture
def api_client():
    from rest_framework.test import APIClient
    return APIClient()

@pytest.fixture
def test_user(db):
    username = os.getenv('TEST_USER_USERNAME')
    password = os.getenv('TEST_USER_PASSWORD')
    user = User.objects.create_user(username=username, password=password)
    return user

@pytest.fixture
def authenticated_client(api_client, test_user):
    api_client.login(username=test_user.username, password=os.getenv('TEST_USER_PASSWORD'))
    return api_client