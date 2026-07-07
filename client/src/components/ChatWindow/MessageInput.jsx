import { useState } from 'react';
import { SendHorizontal } from "lucide-react";

function MessageInput({ onSend }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSend(value);
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-zinc-800 p-4">
      <div className="flex items-center gap-3 rounded-xl bg-[#18181B] border border-zinc-800 px-4">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-transparent py-3 text-white outline-none placeholder:text-zinc-500"
        />

        <button type="submit">
          <SendHorizontal size={20} className="text-zinc-400" />
        </button>
      </div>
    </form>
  );
}

export default MessageInput;