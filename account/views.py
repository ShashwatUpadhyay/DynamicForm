from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from index.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .serializer import LoginSerializer, RegisterSerializer
# Create your views here.

@api_view(['POST'])
def login_api(request):
    data = request.data
    serializer = LoginSerializer(data=data)
    if serializer.is_valid():
        user = authenticate(
                username=serializer.data['username'],
                password=serializer.data['password']
            )
        if user is None:
            return Response({
                "status": False,
                "message": "Invalid credentials!",
                "data" : {}
            })
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            "status" : True,
            "message" : "Login credentials reveived!!!",
            "data" : {
                "token" : token.key
            }
        })
    else:
        return Response({
            "status" : False,
            "message" : "username and password is requuired.",
            "data" : {}
        })
        
@api_view(['POST'])
def register_api(request):
    data = request.data
    print(data)
    serializer = RegisterSerializer(data=data)
    if serializer.is_valid():
        user = User.objects.create_user(**serializer.data)
        return Response({
                "status": True,
                "message": "Data is valid!",
                "data" : serializer.data
            })
    else:
        return Response({
                "status": False,
                "message": "Invalid data!",
                "error" : serializer.errors
            })
        
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView, RegisterView

class GoogleLogin(SocialLoginView): # if you want to use Authorization Code Grant, use this
    adapter_class = GoogleOAuth2Adapter
    callback_url = 'postmessage'
    # callback_url = 'http://localhost:8000/api/account/auth/google/callback/'
    client_class = OAuth2Client

class GoogleCredentialExchangeView(APIView):
    def post(self, request):
        credential = request.data.get('access_token')
        return Response({
            "status":True,
            "credential" : credential
        })


# class GoogleLogin(SocialLoginView): # if you want to use Implicit Grant, use this
#     adapter_class = GoogleOAuth2Adapter
