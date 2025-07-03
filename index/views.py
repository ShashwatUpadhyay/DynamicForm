from django.shortcuts import render
from rest_framework.views import  APIView
from rest_framework.response import  Response
from .models import (Form,Question,Choices,Answers,User)
from .serializers import  FormSerializer, QuestionSerializer,AnswersSerializer,ChoicesSerializer,ResponseSerializer

# Create your views here.

# GET,  POST, PUT, PATCH, DELETE

class FormsAPI(APIView):
    def get(self, request):
        forms = Form.objects.all()
        print(forms)
        serializer = FormSerializer(forms,many=True)
        return Response({
            "status" : "success",
            "message" : "Got get request",
            "data" : serializer.data
        })
        
class FormAPI(APIView):
    def get(self, request):
        code = request.GET.get('code')
        form = Form.objects.get(code=code)
        serializer = FormSerializer(form)
        return Response({
            "status" : "success",
            "message" : "Form fetched sucessfully!",
            "data" : serializer.data
        })
 
    def post(self, request):
        try:
            # data = request.data 
            user = User.objects.first()
            form = Form().create_blank_form(user)
            serializer = FormSerializer(form)
            return Response({
                "status" : True,
                "message" : "Form created successfully",
                "data" : serializer.data
            })
        except Exception as e:
            print(e)
            return Response({
                "status" : False,
                "message" : "Something went wrong",
                "error" : ''
            })
    
    def patch(self, request):
        try:
            data = request.data
            if not data.get('form_id'):
                return Response({
                    "status" : False,
                    "message" : "form_id is required",
                    "data" : {}
                })
                
            form_obj = Form.objects.filter(id = data.get("form_id"))
            if form_obj.exists():
                serializer = FormSerializer(form_obj[0], data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response({
                    "status" : True,
                    "message" : "Form Updated",
                    "data" : serializer.data
                })
                else:
                    return Response({
                    "status" : False,
                    "message" : "From not updated",
                    "error" : serializer.errors
                })
            else:
                return Response({
                    "status" : False,
                    "message" : "Invalid form_id",
                    "data" : {}
                })
        except Exception as e:
            print(e)
            return Response({
                    "status" : False,
                    "message" : "Something went wrong!",
                    "data" : {}
                })
            
            
class QuestionAPI(APIView):
    
    def post(self,request):
        try:
            data = request.data
            
            data['question'] = "Untitled question"
            data['question_type'] = "multiple choice"
            
            serializer = QuestionSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                form = Form.objects.get(id = data['form_id'])
                form.questions.add(Question.objects.get(id = serializer.data['id']))
                return Response({
                    "status" : True,
                    "message" : "Question created successfully!",
                    'data' : serializer.data
                })
            else:
                return Response({
                "status" : False,
                "message" : "Something went wrong!",
                'error' : serializer.errors
            })
        except Exception as e:
            print(e)
            return Response({
                "status" : False,
                "message" : "Something went wrong!",
                'data' : {}
            })
    def patch(self,request):
        try:
            data = request.data
            if not data.get('question_id'):
                return Response({
                    "status" : False,
                    "message" : "question_id is required",
                    "data" : {}                    
                })
            question_obj = Question.objects.filter(id = data.get('question_id')) 
            if question_obj.exists():
                serializer = QuestionSerializer(question_obj[0], data=data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response({
                    "status" : True,
                    "message" : "Question Updated successfully!",
                    'data' : serializer.data
                })
                else:
                    return Response({
                    "status" : False,
                    "message" : "Something went wrong!",
                    'error' : serializer.errors
                })
        except Exception as e:
            print(e)
            return Response({
                "status" : False,
                "message" : "Something went wrong!",
                'data' : {}
            })
            
class ChoiceAPI(APIView):
    
    def post(self , request):
        try:
            data  = request.data
            if not data.get('form_id') or not data.get('question_id'):
                return Response({
                    "status":False,
                    "message" : "form_id and question_id both are required",
                    'data' : {}
                })
            data['choice'] = "Option"
            serializer = ChoicesSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                form = Form.objects.filter(id= data.get('form_id'))
                if form.exists():
                    form[0].questions.get(id= data.get('question_id')).choices.add(Choices.objects.get(id=serializer.data['id']))
                
                return Response({
                    "status":True,
                    "message" : "Choice created successfully",
                    "data" : serializer.data                    
                })
            else:
                return Response({
                "status" : False,
                "message" : "Something went wrong!",
                'error' : serializer.errors
            })
        except Exception as e:
            print(e)
            return Response({
                "status" : False,
                "message" : "Something went wrong!",
                'data' : {}
            })
    def patch(self , request):
        try: 
            data = request.data
            if not data.get('choice_id'):
                return Response({
                "status" : False,
                "message" : "choice_id is required!",
                'data' : {}
            })
            choice_obj = Choices.objects.filter(id = data.get('choice_id'))
            if not choice_obj.exists():
                return Response({
                    "status" : False,
                    "message" : "Invalid choice_id",
                    'data' : {}
                })
            serializer = ChoicesSerializer(choice_obj[0],data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({
                "status" : True,
                "message" : "Choice updated successfully!",
                'data' : serializer.data
            })
            else:
                return Response({
                "status" : False,
                "message" : "Something went wrong!",
                'error' : serializer.errors
            })
        except Exception as e:
            print(e)
            return Response({
                "status" : False,
                "message" : "Something went wrong!",
                'data' : {}
            })