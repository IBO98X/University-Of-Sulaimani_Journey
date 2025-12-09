from django.urls import path
from .views import FileUploadView, StatsView

urlpatterns = [
    path('upload/', FileUploadView.as_view(), name='file-upload'),
    path('stats/', StatsView.as_view(), name='stats'),
]
