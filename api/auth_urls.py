from django.urls import path
from account.views import login_api,register_api

urlpatterns = [
    path('login/',login_api),
    path('register/',register_api),
]
