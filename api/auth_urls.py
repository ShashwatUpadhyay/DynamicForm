from django.urls import path, include
from account.views import login_api,register_api

urlpatterns = [
    path('login/',login_api),
    path('register/',register_api),
]
