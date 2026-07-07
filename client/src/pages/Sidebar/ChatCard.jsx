import { useNavigate } from "react-router-dom";

function ChatCard({ chat }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/chats/${chat.id}`)}
      className="
        flex
        items-center
        gap-3
        px-4
        py-3
        cursor-pointer
        hover:bg-[#18181B]
        transition
      "
    >
      <div
        className="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-full
          bg-zinc-800
          text-white
          font-medium
        "
      >
        {chat.name?.charAt(0) || 'C'}
      </div>

      <div className="flex-1 overflow-hidden">
        <h3 className="text-sm font-medium text-white">
          {chat.name}
        </h3>

        <p
          className="
            truncate
            text-sm
            text-zinc-500
          "
        >
          {chat.description || 'Open room'}
        </p>
      </div>
    </div>
  );
}

export default ChatCard;