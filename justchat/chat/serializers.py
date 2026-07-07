from rest_framework import serializers
from django.contrib.auth.models import User
from .models import ChatRoom, ChatRoomMember, Message, UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'display_name', 'email']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
        )
        UserProfile.objects.get_or_create(user=user, defaults={'email': user.email, 'display_name': user.username})
        return user


class ChatRoomSerializer(serializers.ModelSerializer):
    created_by = UserProfileSerializer(read_only=True)
    participants = UserProfileSerializer(many=True, read_only=True)

    class Meta:
        model = ChatRoom
        fields = ['id', 'name', 'description', 'participants', 'created_by', 'created_at']


class MessageSerializer(serializers.ModelSerializer):
    author = UserProfileSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'content', 'timestamp', 'author']
