from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.contrib.auth.models import User
from .serializer import UserSerializer


@api_view(["POST"])
def create_user(request):
    serializer = UserSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"success":1},
            status=status.HTTP_201_CREATED
        )
    else:
        print(serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
def check_get_email(request):
    email = request.query_params.get('email',None)
    print(email)
    if not email:
        return Response({'error':'Email paramenter is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    user_exits = User.objects.filter(email=email).exists()

    return Response({'isAvailable': user_exits})

@api_view(["GET"])
def check_get_user(request):
    user = request.query_params.get('user',None)
    print(user)
    if not user:
        return Response({'error':'User paramenter is required'},status=status.HTTP_400_BAD_REQUEST)
    
    user_exits = User.objects.filter(username=user).exists()

    return Response({'isAvailable':user_exits})

