import { ArrowRightIcon, LockIcon, MailIcon, User2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { toast } from "react-hot-toast";

export default function Login() {
  const [loginState, setLoginState] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginState) {
      try {
        // Name validation
        if (!name.trim()) {
          throw new Error("Please enter your full name.");
        }

        if (name.trim().length < 2) {
          throw new Error("Your name must be at least 2 characters long.");
        }

        // Email validation
        if (!email.trim()) {
          throw new Error("Please enter your email address.");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email.trim())) {
          throw new Error("Please enter a valid email address.");
        }

        // Password validation
        if (!password) {
          throw new Error("Please create a password.");
        }

        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters long.");
        }

        if (!/[A-Z]/.test(password)) {
          throw new Error(
            "Password must contain at least one uppercase letter.",
          );
        }

        if (!/[a-z]/.test(password)) {
          throw new Error(
            "Password must contain at least one lowercase letter.",
          );
        }

        if (!/[0-9]/.test(password)) {
          throw new Error("Password must contain at least one number.");
        }

        // Confirm password validation
        if (!confirmPassword) {
          throw new Error("Please confirm your password.");
        }

        if (password !== confirmPassword) {
          throw new Error(
            "Passwords do not match. Please make sure both passwords are the same.",
          );
        }
      } catch (error: any) {
        toast.error(
          error?.message || "Please check your information and try again.",
          {
            position: "top-center",
            style: {
              background: "#f50707",
              color: "white",
              fontWeight: "bold",
            },
          },
        );

        return;
      }
    }

    setLoading(true);
    try {
      const { data } = await api.post(
        `/api/auth/${loginState ? "login" : "register"}`,
        {
          name,
          email,
          password,
        },
      );
      login(data, data.token);
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || error?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex flex-col items-center mb-8">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="" className="size-6.5" />
              <h1 className="text-2xl">Post-Pilot</h1>
            </Link>
            <p className="text-slate-500 text-sm mt-1">
              Sign in to your Dashboard
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5 text-sm">
            {!loginState && (
              <div>
                <label className="block mb-1.5">Name</label>
                <div className="relative">
                  <User2Icon className="absolute size-4 left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="you@company.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 outline-slate-300 border border-slate-200 rounded-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}
            <div>
              <label className="block mb-1.5">Email</label>
              <div className="relative">
                <MailIcon className="absolute size-4 left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 outline-slate-300 border border-slate-200 rounded-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block mb-1.5">Password</label>
              <div className="relative">
                <LockIcon className="absolute size-4 left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="********"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 outline-slate-300 border border-slate-200 rounded-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {!loginState && (
              <div>
                <label className="block mb-1.5">Confirm Password</label>
                <div className="relative">
                  <LockIcon className="absolute size-4 left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="********"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 outline-slate-300 border border-slate-200 rounded-full"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-linear-to-r from-red-600 to-red-500 text-white rounded-full text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  {" "}
                  {loginState ? "Sign In" : "Sign Up"}{" "}
                  <ArrowRightIcon className="size-4" />
                </>
              )}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-slate-500">
            {loginState ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => setLoginState(false)}
                  className="text-red-600 cursor-pointer hover:text-red-700"
                >
                  Create one free
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setLoginState(true)}
                  className="text-red-600 cursor-pointer hover:text-red-700"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
