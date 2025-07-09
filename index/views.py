from django.shortcuts import render
from rest_framework.views import  APIView
from rest_framework.response import  Response
from .models import (Form,Question,Choices,Answers,User,Responses)
from .serializers import  FormSerializer, QuestionSerializer,AnswersSerializer,ChoicesSerializer,ResponseSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from utils.utility import generate_random_string, convert_to_local_time_zone
import ast
from collections import defaultdict
from django.utils import timezone
import time
from utils.sheet import create_sheet
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication

# Create your views here.

# GET,  POST, PUT, PATCH, DELETE

class ResponsesViewSet(ModelViewSet):
    queryset = Responses.objects.all()
    serializer_class = ResponseSerializer
    
    @action(detail=False,methods=['post'])
    def save_response(self, request):
        data = request.data
        responses = data.get('responses')
        if not responses['form_id']:
            return Response({
            "status" : False,
            "message" : "form_id  is required...",
            "data" : {},
        })  
        form_id = responses.pop('form_id')
        form = Form.objects.get(code = form_id)
        response = Responses.objects.create(
            code = generate_random_string(15),
            form = form,
            user = request.user
        )
        for q in responses:
            question = Question.objects.get(id = q)
            if question.question_type == 'checkbox':
                answer = Answers.objects.create(question = question,answer=responses[q])
            else:
                answer = Answers.objects.create(question = question, answer = responses[q])
            response.response.add(answer)
        # serializer = ResponseSerializer(data=responses)
        
        return Response({
            "status" : True,
            "message" : "Response Captured..",
            "data" : {},
        })    
        
    @action(detail=False, methods=['get'])
    def get_response(self, request):
        code = request.GET.get('code')
        form = Form.objects.get(code=code)
        responses = Responses.objects.filter(form=form)
        if not responses.exists():
            return Response({
                "status": True,
                "message": "No response submitted yet.",
                "data": {}
            })
        last_response = responses.latest().created_at
        today_start , tomorrow_start = convert_to_local_time_zone()
        today_responses = responses.filter(created_at__gte=today_start,
                                            created_at__lt=tomorrow_start
                                        ).count()
        questions = form.questions.all()
        sheet_id, sheet_url = form.sheet_id ,form.sheet_url
        print(sheet_id, sheet_url)
        has_sheet = True
        sheet_url = form.sheet_url
        if sheet_url is None:
            has_sheet = False
            
        answers = []
        for question in questions:
            temp = {
                'id': question.id,
                'question': question.question,
                'type': question.question_type,
            }
            if question.question_type == 'checkbox':
                temp['chartType'] = 'pie'
            elif question.question_type == 'multiple choice':
                temp['chartType'] = 'bar'   
            else:
                temp['chartType'] = ''   
                
            # Collect all possible options in an ordered list
            option_counter = defaultdict(int)
            submitted_answers = []
            for ans in question.answers.all():
                if question.question_type == 'checkbox':
                    try:
                        selected = ast.literal_eval(ans.answer)
                        for option in selected:
                            option_counter[option] += 1
                    except Exception as e:
                        continue
                elif question.question_type == 'long answer' or question.question_type == 'short answer':
                    submitted_answers.append(ans.answer)
                else:
                    option_counter[ans.answer] += 1

            options = list(option_counter.keys())
            responses_count = [option_counter[o] for o in options]

            temp['options'] = options
            temp['responses'] = responses_count
            temp['answers'] = submitted_answers

            answers.append(temp)
        data = {
            "total_responses": responses.count(),
            "lastResponse": last_response,
            "today_responses": today_responses,
            "has_sheet": has_sheet,
            "sheet_url": sheet_url,
            "questions": answers
        }

        return Response({
            "status": True,
            "message": "Response Fetched!!",
            "data": data
        })
    @action(detail=False, methods=['get'])
    def get_full_response(self, request):
        code = request.GET.get('code')
        form = Form.objects.get(code = code)
        questions = form.questions.all()
        responses = Responses.objects.filter(form=form)
        if not responses.exists():
            return Response({
                "status": True,
                "message": "No response submitted yet.",
                "data": {}
            })
        last_response = responses.latest().created_at
        today_start , tomorrow_start = convert_to_local_time_zone()
        today_responses = responses.filter(created_at__gte=today_start,
                                            created_at__lt=tomorrow_start
                                        ).count()
        questions = form.questions.all()
        sheet_id, sheet_url = form.sheet_id ,form.sheet_url
        has_sheet = True
        sheet_url = form.sheet_url
        if sheet_url is None:
            has_sheet = False
        response_serializer = ResponseSerializer(instance=responses, many=True)
        question_serializer = QuestionSerializer(instance=questions, many=True)
        data={}
        data = {
            "total_responses": responses.count(),
            "lastResponse": last_response,
            "today_responses": today_responses,
            "has_sheet": has_sheet,
            "sheet_url": sheet_url,
            "questions": question_serializer.data,
            "responses": response_serializer.data
        }
        return Response({
            "status": True,
            "message": "Response Fetched!!",
            "data": data
        })
            
    @action(detail=False, methods=['get'])
    def create_sheet(self, request):
        code = request.GET.get('code')
        data={}
        try:
            form = Form.objects.get(code=code)
            email = 'infernalknight96@gmail.com'
            id, url = create_sheet(form, email)
            data = {
                'sheet_id':id,
                'sheet_url':url,
                'sheet_created':True
            }
        except Exception as e:
            print(e)
            return Response({
                "status": False,
                "message": "Something went wrong!",
                "data": {}
            })
        return Response({
            "status": True,
            "message": "Response Fetched!!",
            "data": data
        })

class FormsAPI(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        forms = Form.objects.filter(creator = request.user).order_by('-created_at')
        serializer = FormSerializer(forms,many=True)
        return Response({
            "status" : "success",
            "message" : "Got get request",
            "data" : serializer.data
        })
        
class FormAPI(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        print("user",request.user)        
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
            print(request.user)
            user = request.user
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
            
    def delete(self, request):
        form_id = request.GET.get('code')
        try:
            form = Form.objects.get(code=form_id)
            form.delete()
            return Response({
                        "status" : True,
                        "message" : "Form deleted sucessfully",
                        "data" : form_id
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
                choice = Choices.objects.create(choice = 'Option')
                question = Question.objects.get(id = serializer.data['id'])
                question.choices.add(choice)
                form.questions.add(question)
                choices = [{
                            'id' : choice.id,
                            "uid" : choice.uid,
                            "choice" : choice.choice
                            }]
                print(question.choices.all())
                return Response({
                    "status" : True,
                    "message" : "Question created successfully!",
                    # 'data' : serializer.data,
                    "data" : {
                        "choices" : choices,
                        "id" : question.id,
                        "is_required": question.is_required,
                        "question" : question.question,
                        "question_type" : question.question_type,
                        "uid" : question.uid
                    }
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
    def delete(self , request):
        data = request.data
        uid = data.get('question_uid')
        
        if uid is not None:
            try:
                Question.objects.get(uid=uid).delete()
                return Response({
                    "status" : True,
                    "message" : "Question Deleted Successfully!",
                    "data" : data
                })
            except Exception as e:
                print(e)
                return Response({
                "status" : False,
                "message" : "Something went wrong!",
                "data" : {}
                })
        else:
            return Response({
                "status" : False,
                "message" : "Something went wrong!",
                "data" : data
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
            choice = data.get('choice')
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
    def delete(self, request):
        data = request.data
        uid = data.get('option_uid')
        print(data)
        try:
            choice = Choices.objects.get(uid=uid)
            choice.delete()
            return Response({
                'status' : True,
                "message" : "Option deleted sucessfully",
                "data" : {}
            })
        except Exception as e:
            print(e)
            return Response({
                'status' : False,
                "message" : "Something went wrong!",
                "data" : {}
            })

