import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router";

export default function Navbar() {
  const { user } = { user: false };
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
      <div className="flex items-center justify-between max-w-6xl mx-auto px-4 sm:px-6 h-16">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Logo" className="size-7" />
          <span className="text-xl lg:text-2xl font-medium font-serif text-slate-800">
            Post-Pilot
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-500">
          <a href="#features" className="hover:text-slate-900">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-slate-900">
            How it works
          </a>
        </div>

        {user ? (
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow-sm hover:shadow-red-200 hover:shadow-md"
          >
            Go to Dashboard <ArrowRightIcon className="size-3.5" />
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm text-slate-600 hover:text-slate-900 hidden sm:block"
            >
              Sign In
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-1.5 text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow-sm hover:shadow-red-200 hover:shadow-md"
            >
              Get Started <ArrowRightIcon className="size-3.5" />
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
