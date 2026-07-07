function SearchBar() {
  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search chats..."
        className="
          w-full
          rounded-xl
          bg-[#18181B]
          border
          border-zinc-800
          px-4
          py-3
          text-sm
          text-white
          placeholder:text-zinc-500
          outline-none
          focus:border-zinc-600
        "
      />
    </div>
  );
}

export default SearchBar;