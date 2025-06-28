from django.contrib import admin
from .models import User, Choices, Question, Form, Answers, Response
# Register your models here.

admin.site.register(User)
admin.site.register(Choices)    
admin.site.register(Question)
admin.site.register(Form)
admin.site.register(Answers)
admin.site.register(Response)

