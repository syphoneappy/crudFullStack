from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path("register/", views.create_user),
    path("check_email/", views.check_get_email),
    path("check_user/",views.check_get_user)
]
