// src/components/NavBar.jsx
import { Link, useLocation } from "react-router-dom";
import { MessageSquare } from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <Link to="/" className="text-xl font-bold text-slate-900 hover:text-blue-600 transition">
            SFSU Tutoring
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition ${
                isActive("/") ? "text-blue-600" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium transition ${
                isActive("/about") ? "text-blue-600" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              About
            </Link>

            {/* Dashboard Link - Prominent in top right */}
            <Link
              to="/dashboard?tab=messages"
              className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${
                  isActive("/dashboard")
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
                }
              `}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Student Dashboard</span>
            </Link>

            {/* Tutor Dashboard */}
            <Link
              to="/tutor/dashboard"
              className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
               ${
                 isActive("/tutor/dashboard")
                   ? "bg-green-600 text-white shadow-sm"
                   : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
               }
              `}
            >
              <span className="font-bold text-lg">🎓</span>
              <span>Tutor Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
