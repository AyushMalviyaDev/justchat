import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { roomsApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

function ChatWindow() {
  const { chatId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const loadMessages = async () => {
      if (!chatId) return;
      try {
        const [roomData, messageData] = await Promise.all([roomsApi.getRoom(chatId), roomsApi.getMessages(chatId)]);
        setRoom(roomData);
        setMessages(messageData);
      } catch {
        setRoom(null);
        setMessages([]);
      }
    };

    loadMessages();
  }, [chatId]);

  useEffect(() => {
    if (!chatId || !user) return undefined;

    const scheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsPort = import.meta.env.VITE_WS_PORT || '8000';
    const socketUrl = `${scheme}://${window.location.hostname}:${wsPort}/ws/chat/${chatId}/?user=${encodeURIComponent(user.username)}`;
    const newSocket = new WebSocket(socketUrl);

    newSocket.onopen = () => {
      setSocket(newSocket);
    };

    newSocket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.command === 'new_message') {
          setMessages((prev) => [...prev, payload.message]);
        }
      } catch {
        // Ignore malformed payloads
      }
    };

    newSocket.onerror = () => {
      setSocket(null);
    };

    return () => {
      if (newSocket.readyState === WebSocket.OPEN || newSocket.readyState === WebSocket.CONNECTING) {
        newSocket.close();
      }
    };
  }, [chatId, user]);

  const sendMessage = (content) => {
    if (!chatId || !content.trim() || !socket || !user) return;
    socket.send(JSON.stringify({ command: 'new_message', message: content, sender: user.username }));
  };

  const roomName = useMemo(() => room?.name || 'Select a room', [room]);

  return (
    <div className="flex flex-col h-full bg-[#09090B]">
      <ChatHeader roomName={roomName} />
      <MessageList messages={messages} currentUserName={user?.username} />
      <MessageInput onSend={sendMessage} />
    </div>
  );
}

export default ChatWindow;