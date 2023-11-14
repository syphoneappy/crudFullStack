from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
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
            user.refresh_token = str(refresh_token)
            user.save()

            first_name = user.first_name
            last_name = user.last_name
            return Response(    
                {
                    "success": "Login successful",
                    "access_token": str(access_token),
                    "first_name": first_name,
                    "last_name": last_name,
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

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_task(request, pk):
    try:
        task = tasks.objects.get(pk=pk)
        task.delete()
    except ValueError:
        raise ValueError("Task not found")
    
    return Response({"message":"Deleted Successfully!"}, status=status.HTTP_200_OK)

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_task(request, pk):
    try:
        task = tasks.objects.get(pk=pk)
    except tasks.DoesNotExist:
        return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = TaskSerializer(instance=task, data=request.data)
    print(serializer)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        print(serializer.errors)
        return Response({"error": "Invalid data provided"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def check_token_validity(request):
    return Response({"detail": "Access token is valid"}, status=status.HTTP_200_OK)

access_token_mapping = {}

@api_view(["POST"])
@permission_classes([AllowAny])
def refresh_access_token(request):
    expired_access_token_str = request.data.get("expired_access_token")

    if not expired_access_token_str:
        return Response({"detail": "Expired access token not provided"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        expired_access_token = AccessToken(expired_access_token_str)
        user = access_token_mapping.get(expired_access_token_str)  # Retrieve the user based on the expired access token
        refresh_token = user.refresh_token  # Retrieve the refresh token for the user (you need to adapt this based on your user model)
        new_access_token = AccessToken.for_user(user)
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    return Response({"access_token": str(new_access_token)}, status=status.HTTP_200_OK)