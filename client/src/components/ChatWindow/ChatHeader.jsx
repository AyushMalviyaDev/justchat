import { MoreVertical } from "lucide-react";

function ChatHeader({ roomName = 'Chat room' }) {
  return (
    <div
      className="
        h-16
        border-b
        border-zinc-800
        flex
        items-center
        justify-between
        px-4
      "
    >
      <div className="flex items-center gap-3">

        {/* Avatar */}

        <div
          className="
            h-10
            w-10
            rounded-full
            bg-zinc-800
            flex
            items-center
            justify-center
            text-sm
            font-medium
            text-white
          "
        >
          A
        </div>

        {/* User Info */}

        <div>
          <h2 className="text-sm font-medium text-white">
            {roomName}
          </h2>

          <p className="text-xs text-zinc-500">
            last seen recently
          </p>
        </div>

      </div>

      <button
        className="
          p-2
          rounded-lg
          hover:bg-zinc-800
          transition
        "
      >
        <MoreVertical
          size={20}
          className="text-zinc-400"
        />
      </button>
    </div>
  );
}

export default ChatHeader;