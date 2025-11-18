// src/components/NavBar.jsx
import { Link, useLocation } from "react-router-dom";
import { MessageSquare } from "lucide-react";

export default function Navbar() {
<<<<<<< HEAD
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b border-slate-200">
      <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-slate-900 text-white grid place-items-center font-semibold">
            04
          </div>
          <div>
            <div className="font-semibold leading-tight">CSC648 Section04 Team04</div>
            <div className="text-xs text-slate-500 -mt-0.5">Fall 2025</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Nav to="/">Home</Nav>
          <Nav to="/about">About</Nav>
          <Nav to="/admin">Admin</Nav>
        </div>
      </nav>
    </header>
  );
}
=======
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };
>>>>>>> 9755849db06a36ea8ee792ab81401a74ea41e05a

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
