from rest_framework import serializers
from .models import (
    Form,Question,Answers,Choices,Response,User
)

class ChoicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choices
        exclude = ['created_at','updated_at']

class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoicesSerializer(read_only=True,many=True)
    class Meta:
        model = Question
        exclude = ['created_at','updated_at']

class FormSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)
    
    class Meta:
        model = Form
        exclude = ['created_at','updated_at']
    
    # def to_representation(self, instance):
    #     questions = instance.questions.all()
    #     question_serializer = QuestionSerializer(questions, many=True)
    #     payload = {
    #         "form" : instance.id,
    #         "code" : instance.code,
    #         "title" : instance.title,
    #         "description" : instance.description,
    #         "creator" : instance.creator.username,
    #         "creator" : instance.background_color,
    #         "questions" : question_serializer.data
            
    #     }
    #     return payload

class AnswersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answers
        exclude = ['created_at','updated_at']


class ResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Response
        exclude = ['created_at','updated_at']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ['created_at','updated_at']
