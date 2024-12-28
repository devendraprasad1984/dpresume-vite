from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient


CREATE_USER_URL = reverse('user:create')
TOKEN_URL = reverse('user:token')
ME_URL = reverse('user:me')

DUMMY_USER = 'devendraprasad1984@gmail.com'


def create_user(**params):
    return get_user_model().objects.create_user(**params)


class PublicUserApiTests(TestCase):
    """Test the users API (public)"""


    def setUp(self):
        """will be called before test runs"""
        self.client = APIClient()


    def tearDown(self) -> None:
        """will be called after test runs"""
        pass


    def test_create_valid_user_success(self):
        """test creating user with valid payload"""
        payload = {
            'name': 'Devendra Prasad',
            'email': DUMMY_USER,
            'password': 'dpadmin',
        }
        res = self.client.post(CREATE_USER_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        user = get_user_model().objects.get(**res.data)
        self.assertTrue(user.check_password(payload['password']))
        self.assertNotIn('password', res.data)


    def test_user_exists(self):
        """check if user already exists"""
        payload = {
            'email': DUMMY_USER,
            'password': 'admin',
        }
        create_user(**payload)

        res = self.client.post(CREATE_USER_URL, **payload)
        self.assertTrue(res.status_code, status.HTTP_400_BAD_REQUEST)


    def test_password_too_short(self):
        """test that password must be more than 5 characters long"""
        payload = {
            'email': DUMMY_USER,
            'password': 'as2',
        }
        res = self.client.post(CREATE_USER_URL, **payload)
        self.assertTrue(res.status_code, status.HTTP_400_BAD_REQUEST)
        user_exists = get_user_model().objects.filter(email=payload['email']).exists()
        self.assertFalse(user_exists)


    def test_create_token_for_user(self):
        """test that a token is created for the user"""
        payload = {'email': 'devendraprasad1984@gmail.com', 'password': 'testpass'}
        create_user(**payload)
        res = self.client.post(TOKEN_URL, payload)

        self.assertIn('token', res.data)
        self.assertEqual(res.status_code, status.HTTP_200_OK)


    def test_create_token_invalid_user(self):
        """test that token is not created if invalid credentials are given"""
        create_user(email='testdp@gmail.com', password='testpass')
        payload = {'email': 'testdp@gmail.com', 'password': 'wrong'}
        res = self.client.post(TOKEN_URL, payload)

        self.assertNotIn('token', res.data)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)


    def test_create_token_no_user(self):
        """Test that token is not created if user doesnt exist"""
        payload = {'email': 'testdp@gmail.com', 'password': 'testpass'}
        res = self.client.post(TOKEN_URL, payload)

        self.assertNotIn('token', res.data)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)


    def test_create_token_missing_field(self):
        """Test that token is not created if user doesnt exist"""
        payload = {'email': 'testdp', 'password': ''}
        res = self.client.post(TOKEN_URL, payload)

        self.assertNotIn('token', res.data)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)


    def test_retrieve_user_unauthrised(self):
        """test that auth is required for users"""
        res = self.client.get(ME_URL)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateUserApiTests(TestCase):
    """test api requests that require authentication"""


    def setUp(self):
        self.user = create_user(
            email='test@gmail.com',
            password='testpass',
            name='dp'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)


    def test_retrieve_profile_success(self):
        """test retrieve profile for logged in user"""
        res = self.client.get(ME_URL)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, {
            "email": self.user.email,
            "name": self.user.name
        })


    def test_post_me_not_allowed(self):
        """test that POST is not allowed on ME_URL url"""
        res = self.client.post(ME_URL, {})
        self.assertEqual(res.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)


    def test_update_user_profile(self):
        """test updating user profile for authenticated user"""
        payload = {'name': 'dp1', 'password': 'newpass123'}
        res = self.client.patch(ME_URL, payload)
        self.user.refresh_from_db()
        self.assertEqual(self.user.name, payload['name'])
        self.assertTrue(self.user.check_password(payload['password']))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
