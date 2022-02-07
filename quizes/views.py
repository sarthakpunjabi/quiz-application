from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import Quiz
from django.views.generic import ListView
from django.http import JsonResponse,HttpResponse
from questions.models import Answer, Question
from results.models import Result
from django.shortcuts import redirect
import requests

# Create your views here.

default_categories = {}

temp_categories = ["General Knowledge",
"Books","Film","Music","Musicals & Theatres",
"Television","Video Games","Board Games",
"Science & Nature","Science Computers",
"Science Mathematics","Mythology","Sports",
"Geograpy","History","Politics",
"Art","Celebrities","Animals",
"Vehicles","Comics","Gadgets",
"Japanese","Cartoon & Animations"
]

for index,value in enumerate(temp_categories):
    default_categories[index+9]=value


class QuizListView(ListView):
    model = Quiz
    template_name = 'quizes/main.html'


def add_quiz(request):
    if request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest':
        temp = request.POST
        parameters = {
            "amount":int(temp['amount']),
            "category":int(temp['choice']),
            "difficulty":temp['difficulty'],
            "type":temp['type']
        }
        data = requests.get("https://opentdb.com/api.php",params=parameters).json()["results"]
        return JsonResponse({
            'data':data,
        })
    else:    
        return render(request,"quizes/add_quiz.html",context={"choices":default_categories})

@login_required
def add_save(request):
    print("reached")
    data = request.POST
    data_ = dict(data.lists())
    #creation of quiz
    try:
        access = Quiz.objects.get(name=f"{data_.get('meta[nameofquiz]')[0]}")
        print('accessed')
    except:
        Q,create = Quiz.objects.get_or_create(
            name=f"{data_.get('meta[nameofquiz]')[0]}",
            topic = f"{data_.get('meta[topic]')[0]}",
            number_of_questions = f"{data_.get('meta[numberofquestion]')[0]}",
            time = f"{data_.get('meta[time]')[0]}",
            required_score_to_pass = f"{data_.get('meta[reqscoretopass]')[0]}",
            difficulty = f"{data_.get('meta[difficulty]')[0]}",
        )
        if create:
            print("number of question",Q.number_of_questions)
            for i in range(int(Q.number_of_questions)):
                que = Question.objects.get_or_create(
                    text = f"{data_.get(f'data[{i}][question]')[0]}",
                    quiz_id = Q.id
                )
                ans = Answer.objects.get_or_create(
                    text = f"{data_.get(f'data[{i}][correct_answer]')[0]}",
                    correct = True,
                    question_id = que[0].id
                )
                ans1 = Answer.objects.get_or_create(text = f"{data_.get(f'data[{i}][incorrect_answers][]')[0]}",correct=False,question_id=f"{que[0].id}"),
                ans2 = Answer.objects.get_or_create(text = f"{data_.get(f'data[{i}][incorrect_answers][]')[1]}",correct=False,question_id=f"{que[0].id}"),
                ans3 = Answer.objects.get_or_create(text = f"{data_.get(f'data[{i}][incorrect_answers][]')[2]}",correct=False,question_id=f"{que[0].id}"),
                print(ans1,ans2,ans3)

    print("now to redirect")
    return JsonResponse({"Objective":"Achieved"})
    

@login_required
def quiz_view(request,pk):
    quiz = Quiz.objects.get(pk=pk)
    return render(request,'quizes/quiz.html',{'obj':quiz})

@login_required
def quiz_data_view(request,pk):
    quiz = Quiz.objects.get(pk=pk)
    questions = []
    for q in quiz.get_question():
        answers = []
        for a in q.get_answer():
            answers.append(a.text)
        questions.append({str(q):answers})
    
    return JsonResponse({
        'data':questions,
        'time':quiz.time,
    })

@login_required
def save_quiz_view(request,pk):
    if request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest':
        questions = []
        data = request.POST
        data_ = dict(data.lists())
        data_.pop('csrfmiddlewaretoken')
        print(data_)

        for k in data_.keys():
            question = Question.objects.get(text=k)
            questions.append(question)

        user = request.user
        quiz = Quiz.objects.get(pk=pk)
        score = 0
        multiplier = 100 / quiz.number_of_questions
        results = []
        correct_answer = None

        for q in questions:
            a_selected = request.POST.get(q.text)

            if a_selected != "":
                question_answer = Answer.objects.filter(question=q)
                
                for a in question_answer:
                    if a_selected == a.text:
                        
                        if a.correct:
                            score +=1
                            correct_answer = a.text
                    else:
                        if a.correct:
                            correct_answer = a.text
                
                results.append({str(q):{'correct_answer':correct_answer,'answered':a_selected}})
            else:
                results.append({str(q):'not answered'})

        score_ = score * multiplier 
        Result.objects.create(quiz=quiz,user=user,score=score_)
        if score_ >= quiz.required_score_to_pass:
            return JsonResponse({'passed':True,'score':score_,'results':results})
        else:
            return JsonResponse({'passed':False,'score':score_,'results':results})

    