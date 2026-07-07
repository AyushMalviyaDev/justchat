import Sidebar from "../Sidebar/Sidebar";
import ChatWindow from "../../components/ChatWindow/ChatWindow";

function Chats() {
  return (
    <div className="h-screen bg-[#09090B]">

      {/* Mobile */}

      <div className="md:hidden h-full">
        <Sidebar />
      </div>

      {/* Desktop & Tablet */}

      <div className="hidden md:flex h-full">

        <div className="w-[340px] border-r border-zinc-800">
          <Sidebar />
        </div>

        <div className="flex-1">
          <ChatWindow />
        </div>

      </div>

    </div>
  );
}

export default Chats;