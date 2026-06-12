from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    display_name = models.CharField(max_length=255, blank=True)
    email = models.EmailField(blank=True)

    def __str__(self):
        return self.display_name or self.user.username

    def get_display_name(self):
        return self.display_name or self.user.username


class ChatRoom(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, blank=False)
    description = models.TextField(blank=True)
    participants = models.ManyToManyField(UserProfile, related_name='chatrooms')
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(UserProfile, related_name='created_chatrooms', on_delete=models.CASCADE)
    
    def __str__(self):
        return self.name
    
    def add_participant(self, user):
        self.participants.add(user)
        ChatRoomMember.objects.get_or_create(user=user, chat_room=self)


class ChatRoomMember(models.Model):
    user = models.ForeignKey(UserProfile, related_name='chatroom_memberships', on_delete=models.CASCADE)
    chat_room = models.ForeignKey(ChatRoom, related_name='members', on_delete=models.CASCADE)
    joined_at = models.DateTimeField(auto_now_add=True)
    role = models.CharField(max_length=50, default='member')
    
    def __str__(self):
        return f"{self.user.display_name or self.user.user.username} in {self.chat_room.name}"
    
    def mute_member(self, moderator=None):
        if self.role == 'member' and self.chat_room.created_by != self.user:
            self.role = 'muted'
            self.save()
            return True
        return False
    
    def unmute_member(self, moderator=None):
        if self.role == 'muted' and self.chat_room.created_by != self.user:
            self.role = 'member'
            self.save()
            return True
        return False
    
    def ban_member(self, moderator=None):
        if self.role != 'banned' and self.chat_room.created_by != self.user:
            self.role = 'banned'
            self.save()
            return True
        return False
    
    def unban_member(self, moderator=None):
        if self.role == 'banned' and self.chat_room.created_by != self.user:
            self.role = 'member'
            self.save()
            return True
        return False
    

class Message(models.Model):
    group = models.ForeignKey(ChatRoom, related_name='messages', on_delete=models.CASCADE)
    author = models.ForeignKey(UserProfile, related_name='author_messages', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    message_type = models.CharField(max_length=50, default='text')
    
    
    def __str__(self):
        return self.author.display_name or self.author.user.username

    @classmethod
    def last_10_messages(cls, limit=10, room=None):
        query = cls.objects.order_by('-timestamp')
        if room:
            query = query.filter(group=room)
        return query[:limit]
    
class voice_message(models.Model):
    group = models.ForeignKey(ChatRoom, related_name='voice_messages', on_delete=models.CASCADE)
    author = models.ForeignKey(UserProfile, related_name='author_voice_messages', on_delete=models.CASCADE)
    audio_file = models.FileField(upload_to='voice_messages/')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.author.display_name or self.author.user.username
    
class voice_chat(models.Model):
    group = models.ForeignKey(ChatRoom, related_name='voice_chats', on_delete=models.CASCADE)
    participants = models.ManyToManyField(UserProfile, related_name='voice_chats')
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"Voice chat in {self.group.name}"