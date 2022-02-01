from django.urls import path
from .views import (
    QuizListView,
    quiz_view,
    quiz_data_view,
    save_quiz_view,
    add_quiz,
    add_save
)

app_name = 'quizes'

urlpatterns = [
    path('',QuizListView.as_view(),name='main-view'),
    path('add/',add_quiz,name='add-quiz'),
    path('add/save',add_save,name='add-save'),
    path('<pk>/',quiz_view,name='quiz-view'),
    path('<pk>/data',quiz_data_view,name="quiz-data-view"),
    path('<pk>/save',save_quiz_view,name="save-view"),
]