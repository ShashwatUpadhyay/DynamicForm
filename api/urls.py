from django.urls import path,include
from index.views import FormAPI,QuestionAPI,ChoiceAPI,FormsAPI,ResponsesViewSet,get_csrf
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register('response', ResponsesViewSet, basename='response')

urlpatterns = [
    path('', include(router.urls)),
    path('account/', include('api.auth_urls')),
    path('forms/', FormsAPI.as_view()),
    path('form/', FormAPI.as_view()),
    path('question/', QuestionAPI.as_view()),
    path('choice/', ChoiceAPI.as_view()),
    path('get-csrf/', get_csrf),
]