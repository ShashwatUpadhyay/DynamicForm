from django.urls import path
from index.views import FormAPI,QuestionAPI


urlpatterns = [
    path('form/', FormAPI.as_view()),
    path('question/', QuestionAPI.as_view()),
]