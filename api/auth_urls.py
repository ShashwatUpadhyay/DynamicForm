from django.urls import path, include
from account.views import login_api,register_api,GoogleLogin

urlpatterns = [
    path('dj-rest-auth/', include('dj_rest_auth.urls')),
    path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),
    path('auth/', include('allauth.urls')),
    path('login/',login_api),
    path('register/',register_api),
]
urlpatterns += [
    path('dj-rest-auth/google/', GoogleLogin.as_view(), name='google_login')
]