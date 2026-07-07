import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

function AuthInput({
  icon,
  type,
  placeholder,
  value,
  onChange,
  name,
}) {
  const [showPassword, setShowPassword] =
    useState(false);

  const isPassword = type === "password";

  return (
    <div
            className="
        flex
        items-center
        rounded-xl
        border
        border-zinc-800
        bg-[#18181B]
        px-4
        transition-all
        focus-within:border-zinc-600
        "
    >
      <div className="text-zinc-500">
        {icon}
      </div>

      <input
        name={name}
        type={
          isPassword
            ? showPassword
              ? "text"
              : "password"
            : type
        }
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          h-12
          w-full
          bg-transparent
          px-3
          text-sm
          text-white
          placeholder:text-zinc-500
          outline-none
        "
      />

      {isPassword && (
        <button
          type="button"
          onClick={() =>
            setShowPassword(!showPassword)
          }
          className="text-zinc-500"
        >
          {showPassword ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>
      )}
    </div>
  );
}

export default AuthInput;