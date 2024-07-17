import pytest
from rest_framework.test import APIClient
from django.urls import reverse

@pytest.mark.django_db
class TestDocumentation:
    def setup_method(self):
        self.client = APIClient()
        self.swagger_url = reverse('schema-swagger-ui')
        self.redoc_url = reverse('schema-redoc')

    def test_swagger_documentation(self):
        response = self.client.get(self.swagger_url, format='json')
        assert response.status_code == 200
        assert 'swagger' in response.content.decode('utf-8').lower()

    def test_redoc_documentation(self):
        response = self.client.get(self.redoc_url, format='json')
        assert response.status_code == 200
        assert 'redoc' in response.content.decode('utf-8').lower()