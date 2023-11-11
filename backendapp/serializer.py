from rest_framework import serializers
from .models import CustomUser, tasks
from django import forms

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id",'username','email','first_name','last_name','password','is_subscribed']
        extra_kwargs = {"password": {'write_only':True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            is_subscribed=validated_data["is_subscribed"]
        )
        return user
    

class TaskSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all(), required=False)
    class Meta:
        model = tasks
        fields = ["id","user", "name", "description", "due_date", "status"]
