from django.urls import path
from account.views import login_api

urlpatterns = [
    path('login/',login_api),
]
