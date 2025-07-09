from rest_framework import serializers
from index.models import User
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError


class LoginSerializer(serializers.Serializer):
    username=serializers.CharField()
    password=serializers.CharField()
    

class RegisterSerializer(serializers.Serializer):
    first_name=serializers.CharField()
    last_name=serializers.CharField()
    email=serializers.EmailField()
    username=serializers.CharField()
    password=serializers.CharField()
    
    def validate_email(self, data):
        user_exist = User.objects.filter(email = data).exists()
        print(user_exist)
        if user_exist:
            raise ValidationError('Email already exists.')
        else:
            return super().validate(data)
        
    def validate_username(self, data):
        user_exist = User.objects.filter(username = data).exists()
        print(user_exist)
        if user_exist:
            raise ValidationError('Username already exists.')
        else:
            return super().validate(data)