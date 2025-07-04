from django.db import models
from .choices import QUSETION_TYPE_CHOICES
from django.contrib.auth.models import AbstractUser, User
from utils.utility import generate_random_string
import uuid
# Create your models here.

class User(AbstractUser, models.Model):
    email = models.EmailField(unique=True)

class BaseModel(models.Model):
    uid = models.CharField(max_length=100, default=uuid.uuid4, unique=True )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class Choices(BaseModel):
    choice = models.CharField(max_length=255)

    def __str__(self):
        return self.choice

class Question(BaseModel):
    question = models.CharField(max_length=255)
    question_type = models.CharField(max_length=100, choices=QUSETION_TYPE_CHOICES)
    is_required = models.BooleanField(default=True)
    choices = models.ManyToManyField(Choices,blank=True, related_name="choices")  # For multiple choice or checkbox options

    def __str__(self):
        return self.question
    
class Form(BaseModel):
    code = models.CharField(max_length=100, unique=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='forms')
    background_color = models.CharField(max_length=10, default='#FFFFFF')  # Hex color code
    collect_email = models.BooleanField(default=False)
    questions = models.ManyToManyField(Question, related_name='forms', blank=True)
    
    @staticmethod
    def create_blank_form(user):
        token = generate_random_string()
        choices = Choices.objects.create(choice = 'Option 1')
        question = Question.objects.create(question_type = 'multiple choice', question='Untitled question')
        question.choices.add(choices)
        form = Form(code=token, title='Untitled form' ,creator = user)
        form.save()
        form.questions.add(question)
        return form

    def __str__(self):
        return self.title
    
class Answers(BaseModel):
    answer = models.TextField()  # Store the answer as text; can be JSON if needed
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')

    def __str__(self):
        return self.answer

class Response(BaseModel):
    code = models.CharField(max_length=100, unique=True)  
    form = models.ForeignKey(Form, on_delete=models.CASCADE, related_name='responses')
    responder_ip = models.GenericIPAddressField(blank=True, null=True)  # Store IP address of the responder
    responder_email = models.EmailField(blank=True, null=True)  # Store email if collect_email is True
    response = models.ManyToManyField(Answers,  related_name="answers")  # Store answers as a JSON object
    
    def __str__(self):
        return self.responder_email 