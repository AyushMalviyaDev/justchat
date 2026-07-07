import { useEffect, useState } from 'react';
import ChatCard from './ChatCard';
import { roomsApi } from '../../services/api';

function ChatList() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const data = await roomsApi.list();
        setRooms(data);
      } catch {
        setRooms([]);
      }
    };

    loadRooms();
  }, []);

  return (
    <div>
      {rooms.map((chat) => (
        <ChatCard key={chat.id} chat={chat} />
      ))}
    </div>
  );
}

export default ChatList;