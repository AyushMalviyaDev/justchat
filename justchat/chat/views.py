import json
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404, render
from django.utils.safestring import mark_safe
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import ChatRoom, ChatRoomMember, Message, UserProfile
from .serializers import ChatRoomSerializer, MessageSerializer, RegisterSerializer, UserProfileSerializer


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        profile, _ = UserProfile.objects.get_or_create(user=user, defaults={'email': user.email, 'display_name': user.username})
        login(request, user)
        return Response({'user': {'id': user.id, 'username': user.username}, 'profile': UserProfileSerializer(profile).data}, status=status.HTTP_201_CREATED)
    return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username') or request.data.get('email')
    password = request.data.get('password')
    if not username or not password:
        return Response({'error': 'Username/email and password are required.'}, status=400)

    user = User.objects.filter(username=username).first() or User.objects.filter(email=username).first()
    if not user or not user.check_password(password):
        return Response({'error': 'Invalid credentials.'}, status=401)

    login(request, user)
    profile, _ = UserProfile.objects.get_or_create(user=user, defaults={'email': user.email, 'display_name': user.username})
    return Response({'user': {'id': user.id, 'username': user.username}, 'profile': UserProfileSerializer(profile).data})


@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)
    return Response({'message': 'Logged out'})


@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    profile, _ = UserProfile.objects.get_or_create(user=request.user, defaults={'email': request.user.email, 'display_name': request.user.username})
    return Response(UserProfileSerializer(profile).data)


@csrf_exempt
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def rooms_view(request):
    if request.method == 'GET':
        rooms = ChatRoom.objects.prefetch_related('participants').order_by('-created_at')
        return Response(ChatRoomSerializer(rooms, many=True).data)

    name = request.data.get('name', '').strip()
    if not name:
        return Response({'error': 'Room name is required.'}, status=400)

    profile = request.user.profile
    room = ChatRoom.objects.create(name=name, description=request.data.get('description', ''), created_by=profile)
    room.participants.add(profile)
    ChatRoomMember.objects.get_or_create(user=profile, chat_room=room)
    return Response(ChatRoomSerializer(room).data, status=status.HTTP_201_CREATED)


@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def room_detail_view(request, room_id):
    room = get_object_or_404(ChatRoom, id=room_id)
    return Response(ChatRoomSerializer(room).data)


@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def join_room_view(request, room_id):
    room = get_object_or_404(ChatRoom, id=room_id)
    profile = request.user.profile
    ChatRoomMember.objects.get_or_create(user=profile, chat_room=room)
    room.participants.add(profile)
    return Response({'message': 'Joined room'})


@csrf_exempt
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def room_messages_view(request, room_id):
    room = get_object_or_404(ChatRoom, id=room_id)
    if request.method == 'GET':
        messages = Message.objects.filter(group=room).select_related('author', 'author__user').order_by('timestamp')
        return Response(MessageSerializer(messages, many=True).data)

    content = request.data.get('content', '').strip()
    if not content:
        return Response({'error': 'Message content is required.'}, status=400)

    profile = request.user.profile
    message = Message.objects.create(group=room, author=profile, content=content)
    return Response(MessageSerializer(message).data, status=201)


@login_required
def index(request):
    return render(request, 'chat/index.html')


@login_required
def room(request, room_name):
    return render(request, 'chat/room.html', {
        'room_name_json': mark_safe(json.dumps(room_name)),
        'username': mark_safe(json.dumps(request.user.username)),
    })

