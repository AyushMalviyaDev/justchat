import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { useState } from "react";
import AuthInput from "../Auth/AuthInput";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(username, password);
      navigate('/chats');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT SECTION */}

        <div className="hidden lg:flex flex-col justify-center px-20 xl:px-32 relative border-r border-zinc-800">

          <div className="absolute top-10 left-20">
            <h1 className="text-xl font-semibold tracking-wide">
              JUSTCHAT
            </h1>
          </div>

          <div className="absolute text-[220px] font-bold text-zinc-900 select-none">
            H
          </div>

          <div className="relative z-10 max-w-xl">
            <h2 className="text-6xl font-bold leading-tight">
              Messaging built
              <br />
              for modern
              <br />
              communities.
            </h2>

            <p className="mt-8 text-lg text-zinc-500">
              Fast, secure and designed for teams,
              friends and communities that stay connected.
            </p>
          </div>
        </div>

        {/* RIGHT SECTION */}

        <div className="flex items-center justify-center px-6 py-10">

          <div className="w-full max-w-md">

            {/* Mobile Logo */}

            <div className="mb-10 text-center lg:hidden">
              <h1 className="text-xl font-semibold tracking-wide">
                HIBIKI
              </h1>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-[#111113] p-8 md:p-10">

              <div className="mb-8">
                <h2 className="text-3xl font-semibold">
                  Welcome back
                </h2>

                <p className="mt-2 text-zinc-500">
                  Sign in to continue.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <AuthInput
                  icon={<Mail size={18} />}
                  type="text"
                  placeholder="Username or email"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                />

                <AuthInput
                  icon={<Lock size={18} />}
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />

                {error ? <p className="text-sm text-red-400">{error}</p> : null}

                <button
                  type="submit"
                  className="
                    h-12
                    w-full
                    rounded-xl
                    bg-white
                    text-black
                    font-medium
                    transition
                    hover:bg-zinc-200
                  "
                >
                  Continue
                </button>
              </form>

              <div className="mt-6 flex justify-between text-sm">
                <button className="text-zinc-500 hover:text-zinc-300">
                  Forgot password?
                </button>

                <Link
                  to="/register"
                  className="text-zinc-300 hover:text-white"
                >
                  Create account
                </Link>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Login;