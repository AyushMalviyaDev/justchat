import { useState } from 'react';
import SearchBar from "./SearchBar";
import ChatList from "./ChatList";
import { roomsApi } from '../../services/api';

function Sidebar() {
  const [roomName, setRoomName] = useState('');
  const [error, setError] = useState('');

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!roomName.trim()) return;
    try {
      await roomsApi.create({ name: roomName, description: 'New room' });
      setRoomName('');
      setError('');
      window.location.reload();
    } catch (err) {
      setError(err.message || 'Could not create room');
    }
  };
  return (
    <div
      className="
        h-full
        bg-[#111113]
        border-r
        border-zinc-800
      "
    >
      <div
        className="
          px-4
          py-5
          border-b
          border-zinc-800
        "
      >
        <h1
          className="
            text-lg
            font-semibold
            text-white
          "
        >
          JUSTCHAT 
        </h1>
      </div>

      <SearchBar />

      <form onSubmit={handleCreateRoom} className="border-b border-zinc-800 p-4 space-y-2">
        <input
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Create a room"
          className="w-full rounded-xl bg-[#18181B] border border-zinc-800 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none"
        />
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <button type="submit" className="w-full rounded-xl bg-white px-4 py-2 text-sm font-medium text-black">Create room</button>
      </form>

      <ChatList />
    </div>
  );
}

export default Sidebar;