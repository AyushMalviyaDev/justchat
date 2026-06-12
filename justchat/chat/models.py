from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    display_name = models.CharField(max_length=255, blank=True)
    email = models.EmailField(blank=True)

class ChatRoom(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, blank=False)
    description = models.TextField(blank=True)
    participants = models.ManyToManyField(UserProfile, related_name='chatrooms')
    cretaed_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(UserProfile, related_name='created_chatrooms', on_delete=models.CASCADE)
    
    def __str__(self):
        return self.name
    
    def add_participant(self, user):
        self.participants.add(user)
        ChatRoomMember.objects.create(user=user, chat_room=self)
    

class ChatRoomMember(models.Model):
    user = models.ForeignKey(UserProfile, related_name='chatroom_memberships', on_delete=models.CASCADE)
    chat_room = models.ForeignKey(ChatRoom, related_name='members', on_delete=models.CASCADE)
    joined_at = models.DateTimeField(auto_now_add=True)
    role = models.CharField(max_length=50, default='member')
    
    def __str__(self):
        return f"{self.user.username} in {self.chat_room.name}"
    
    def mutemember(self):
        if(self.role == 'member' and self.chat_room.created_by != self.user):
            self.role = 'muted'
            self.save()
    
    def unmutemember(self):
        if(self.role == 'muted' and self.chat_room.created_by != self.user):
            self.role = 'member'
            self.save()
    
    def banmember(self):
        if(self.role != 'banned' and self.chat_room.created_by != self.user):
            self.role = 'banned'
            self.save()
    
    def unbanmember(self):
        if(self.role == 'banned' and self.chat_room.created_by != self.user):
            self.role = 'member'
            self.save()
    

class Message(models.Model):
    group = models.ForeignKey(ChatRoom, related_name='messages', on_delete=models.CASCADE)
    author = models.ForeignKey(UserProfile, related_name='author_messages', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    message_type = models.CharField(max_length=50, default='text')
    
    
    def __str__(self):
        return self.author.username
    def last_10_messages():
        return Message.objects.order_by('-timestamp').all()[:10]
    
class voice_message(models.Model):
    group = models.ForeignKey(ChatRoom, related_name='voice_messages', on_delete=models.CASCADE)
    author = models.ForeignKey(UserProfile, related_name='author_voice_messages', on_delete=models.CASCADE)
    audio_file = models.FileField(upload_to='voice_messages/')
    timestamp = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.author.username
    
    