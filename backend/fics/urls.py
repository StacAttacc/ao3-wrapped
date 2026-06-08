from django.urls import path

from .views import FicDetailView, FicListView, LoginView, RegisterView

urlpatterns = [
    path("fics/", FicListView.as_view()),
    path("fics/<str:ao3_id>/", FicDetailView.as_view()),
    path("auth/register/", RegisterView.as_view()),
    path("auth/login/", LoginView.as_view()),
]
