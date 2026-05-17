import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  PenSquare,
  User,
  Mail,
  LockKeyhole,
  ArrowRight,
} from "lucide-react";

export default function Auth({ onAuth }) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const url = isSignup
        ? "https://peblo-assginmentbackend.onrender.com/auth/signup"
        : "https://peblo-assginmentbackend.onrender.com/auth/login";

      const body = isSignup
        ? { name, email, password }
        : { email, password };

      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Authentication failed");

      onAuth(data.user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7efef] overflow-hidden flex items-center justify-center px-6 py-10 relative">
      {/* background blobs */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
        className="absolute top-16 left-16 w-44 h-44 bg-[#d7e6d2] rounded-[40%]"
      />

      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 7 }}
        className="absolute bottom-10 right-10 w-52 h-52 bg-[#d9d2f0] rounded-[45%]"
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-5xl rounded-[40px] overflow-hidden border border-black/10 shadow-[0_20px_80px_rgba(0,0,0,0.08)] bg-[#f8f0ef] grid lg:grid-cols-2"
      >
        {/* LEFT */}
        <div className="relative p-12 lg:p-16 flex flex-col justify-between bg-[#f4e9e8]">
          <div>
            <motion.div
              whileHover={{ rotate: 10, scale: 1.05 }}
              className="w-16 h-16 rounded-full bg-[#d7e6d2] flex items-center justify-center mb-8"
            >
              <PenSquare className="text-[#2e2b28]" size={30} />
            </motion.div>

            <h1 className="text-5xl leading-tight font-black text-[#2d2926]">
              brighten up
            </h1>

            <p className="mt-6 text-[#4d4742] leading-relaxed text-lg max-w-md">
              Capture your thoughts beautifully with a soft modern notes
              experience designed to feel calm, elegant, and effortless.
            </p>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <div className="bg-[#d9d2f0] p-4 rounded-full">
              <Sparkles className="text-[#2d2926]" size={22} />
            </div>

            <div>
              <p className="font-semibold text-[#2d2926]">
                Smooth writing experience
              </p>
              <p className="text-sm text-[#5b5652]">
                Organize ideas with style.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative bg-[#fffaf8] p-10 lg:p-14 flex items-center">
          <div className="w-full">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-[#2d2926]">
                {isSignup ? "Create Account" : "Welcome Back"}
              </h2>

              <p className="text-[#6b645f] mt-2">
                {isSignup
                  ? "Start creating beautiful notes."
                  : "Login to continue your workspace."}
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 bg-red-100 border border-red-200 text-red-700 p-3 rounded-2xl text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={submit} className="space-y-5">
              {isSignup && (
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#857d76]"
                    size={18}
                  />

                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-[#e4d8d4] bg-[#fff] outline-none focus:ring-2 focus:ring-[#d7e6d2] transition-all"
                  />
                </div>
              )}

              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#857d76]"
                  size={18}
                />

                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-[#e4d8d4] bg-[#fff] outline-none focus:ring-2 focus:ring-[#d7e6d2] transition-all"
                />
              </div>

              <div className="relative">
                <LockKeyhole
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#857d76]"
                  size={18}
                />

                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  type="password"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-[#e4d8d4] bg-[#fff] outline-none focus:ring-2 focus:ring-[#d7e6d2] transition-all"
                />
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
                className="w-full bg-[#2d2926] text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-2 transition-all"
              >
                {isSignup ? "Create Account" : "Login"}
                <ArrowRight size={18} />
              </motion.button>
            </form>

            <button
              type="button"
              onClick={() => setIsSignup((v) => !v)}
              className="mt-6 text-sm text-[#5f5954] hover:text-black transition"
            >
              {isSignup
                ? "Already have an account? Login"
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
