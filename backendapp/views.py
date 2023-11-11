from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from .models import CustomUser, tasks
from .serializer import UserSerializer, TaskSerializer
from django.contrib.auth import authenticate, login
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework.permissions import IsAuthenticated
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
    
    user_exits = CustomUser.objects.filter(email=email).exists()

    return Response({'isAvailable': user_exits})

@api_view(["GET"])
def check_get_user(request):
    user = request.query_params.get('user',None)
    print(user)
    if not user:
        return Response({'error':'User paramenter is required'},status=status.HTTP_400_BAD_REQUEST)
    
    user_exits = CustomUser.objects.filter(username=user).exists()

    return Response({'isAvailable':user_exits})

store_token = []
@api_view(["POST", "GET"])
def login_user(request):
    if request.method == "POST":
        data = request.data
        username = data.get("username")
        password = data.get("password")

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)

            access_token = AccessToken.for_user(user)
            refresh_token = RefreshToken.for_user(user)
            store_token.append(str(refresh_token))
            return Response(    
                {
                    "success": "Login successful",
                    "access_token": str(access_token),
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {
                    "message": "Invalid Credentials",
                },
                status=401,
            )
    else:
        return Response(
            {"message": "Invalid request method"},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )
    
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_task(request):
    request.data["user"] = request.user.id
    serializer = TaskSerializer(data=request.data)

    if serializer.is_valid():
        task = serializer.save()
        serialized_task = TaskSerializer(task).data
        return Response({"task": serialized_task}, status=status.HTTP_201_CREATED)
    else:
        return Response({"error": "Invalid serializer data", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_tasks(request):
    task = tasks.objects.filter(user=request.user)
    serializer = TaskSerializer(task, many=True)
    return Response(serializer.data)    

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def delete_task(request, pk):
    pass