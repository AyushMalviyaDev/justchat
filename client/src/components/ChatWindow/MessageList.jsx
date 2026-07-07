function MessageList({ messages = [], currentUserName }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => {
        const author = message.author;
        const authorName = typeof author === 'string'
          ? author
          : author?.display_name || author?.username || message.author_username || 'User';
        const isSelf = message.author_username === currentUserName || author?.username === currentUserName || author === currentUserName;

        return (
          <div key={message.id} className={`flex ${isSelf ? 'justify-end' : ''}`}>
            <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-white ${isSelf ? 'bg-blue-600' : 'bg-zinc-800'}`}>
              <p className="text-xs text-zinc-400">{authorName}</p>
              <p>{message.content}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MessageList;