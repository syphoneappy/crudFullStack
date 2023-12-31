from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path("register/", views.create_user),
    path("check_email/", views.check_get_email),
    path("check_user/",views.check_get_user),
    path("login/", views.login_user),
    path("create/",views.create_task),
    path("get_data/",views.get_tasks),
    path('delete/<int:pk>',views.delete_task),
    path('update/<int:pk>',views.update_task),
    path('check_access_token/',views.check_token_validity),
    path('token/', views.refresh_access_token),
    path('get-data-search/',views.get_tasks_search)
]
