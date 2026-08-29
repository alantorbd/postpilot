import { Link } from "react-router";

export default function Footer() {
  return (
    <footer
      style={{ background: "#fafafa", borderTop: "1px solid rgba(0,0,0,0.07)" }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4"
          style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}
        >
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Post-Pilot. All rights reserved.
          </p>
          <p className="text-xs text-gray-400">
            Developed By: Md. Abdullah Al Antor
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-gray-400 hover:text-gray-700">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-gray-400 hover:text-gray-700">
              Terms of Service
            </a>
            <Link
              to="/login"
              className="text-xs text-gray-400 hover:text-gray-700"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
