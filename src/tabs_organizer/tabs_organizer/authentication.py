from rest_framework.authentication import TokenAuthentication

class CookieTokenAuthentication(TokenAuthentication):
    """ Custom TokenAuthentication that checks for the token in cookies. """
    def authenticate(self, request):
        # Look for the token in the cookies if not in headers
        auth_token = request.COOKIES.get('auth_token')
        if auth_token:
            return self.authenticate_credentials(auth_token)
        return None