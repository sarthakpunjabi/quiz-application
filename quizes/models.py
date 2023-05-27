from django.db import models
import random

DIFF_CHOICES = (   
    ('easy','easy'),
    ('medium','medium'),
    ('hard','hard'),
)
# Create your models here.
class Quiz(models.Model):
    name = models.CharField(max_length=120)
    topic = models.CharField(max_length=120)
    number_of_questions = models.IntegerField()
    time = models.IntegerField(help_text="Duration of the quiz")
    required_score_to_pass = models.IntegerField(help_text="required score in percent")
    difficulty = models.CharField(max_length=6,choices=DIFF_CHOICES)

    class Meta:
        verbose_name_plural = 'Quizes'

    def __str__(self):
        return f"{self.name}-{self.topic}"

    def get_question(self):
        que = list(self.question_set.all())
        random.shuffle(que)
        return que[:self.number_of_questions] 