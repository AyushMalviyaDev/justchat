import json
from urllib.parse import parse_qs

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser

from .models import ChatRoom, Message, UserProfile

User = get_user_model()


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_id}'
        self.user = self.scope['user']

        if isinstance(self.user, AnonymousUser):
            query_string = self.scope.get('query_string', b'').decode()
            params = parse_qs(query_string)
            username = params.get('user', [None])[0]
            if username:
                self.user = User.objects.filter(username=username).first()

        if isinstance(self.user, AnonymousUser) or self.user is None:
            self.close(code=4001)
            return

        async_to_sync(self.channel_layer.group_add)(self.room_group_name, self.channel_name)
        self.accept()

        self.send(text_data=json.dumps({
            'command': 'connected',
            'user': self.user.username,
        }))

    def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            async_to_sync(self.channel_layer.group_discard)(self.room_group_name, self.channel_name)

    def receive(self, text_data):
        data = json.loads(text_data)
        if data.get('command') == 'new_message':
            self.handle_new_message(data)

    def handle_new_message(self, data):
        room = None
        if self.room_id.isdigit():
            room = ChatRoom.objects.filter(id=int(self.room_id)).first()
        else:
            room = ChatRoom.objects.filter(name=self.room_id).first()
        if not room:
            return

        profile, _ = UserProfile.objects.get_or_create(
            user=self.user,
            defaults={'display_name': self.user.username, 'email': self.user.email},
        )
        content = (data.get('message') or '').strip()
        if not content:
            return

        message = Message.objects.create(group=room, author=profile, content=content)
        payload = {
            'command': 'new_message',
            'message': self.message_to_json(message),
        }
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {'type': 'chat_message', 'message': payload},
        )

    def message_to_json(self, message):
        return {
            'id': message.id,
            'author': message.author.display_name or message.author.user.username,
            'author_username': message.author.user.username,
            'content': message.content,
            'timestamp': message.timestamp.isoformat(),
        }

    def chat_message(self, event):
        self.send(text_data=json.dumps(event['message']))