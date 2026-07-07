import { Link, useNavigate } from "react-router-dom";
import {
  User,
  AtSign,
  Mail,
  Lock,
} from "lucide-react";
import { useState } from "react";

import AuthInput from "../Auth/AuthInput";
import { useAuth } from "../../context/AuthContext";

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      navigate('/chats');
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT PANEL */}

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
              Join the next
              <br />
              generation of
              <br />
              communities.
            </h2>

            <p className="mt-8 text-lg text-zinc-500">
              Create your account and start
              chatting, collaborating and building
              communities.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL */}

        <div className="flex items-center justify-center px-6 py-10">

          <div className="w-full max-w-md">

            <div className="mb-10 text-center lg:hidden">
              <h1 className="text-xl font-semibold tracking-wide">
                HIBIKI
              </h1>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-[#111113] p-8 md:p-10">

              <div className="mb-8">
                <h2 className="text-3xl font-semibold">
                  Create account
                </h2>

                <p className="mt-2 text-zinc-500">
                  Get started with HIBIKI.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <AuthInput
                  icon={<User size={18} />}
                  type="text"
                  placeholder="Full name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                />

                <AuthInput
                  icon={<AtSign size={18} />}
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />

                <AuthInput
                  icon={<Mail size={18} />}
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />

                <AuthInput
                  icon={<Lock size={18} />}
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />

                <AuthInput
                  icon={<Lock size={18} />}
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
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
                  Create Account
                </button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-zinc-500">
                  Already have an account?
                </span>

                <Link
                  to="/"
                  className="ml-2 text-zinc-300 hover:text-white"
                >
                  Sign in
                </Link>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Register;