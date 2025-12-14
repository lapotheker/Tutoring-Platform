// src/components/NavBar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";

function getCurrentUser() {
  try {
    return (
      JSON.parse(localStorage.getItem("demoUser")) || JSON.parse(sessionStorage.getItem("demoUser"))
    );
  } catch {
    return null;
  }
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());

  // Update user when route changes (covers post-login navigation)
  useEffect(() => {
    setUser(getCurrentUser());
  }, [location]);

  // Keep user state in sync across tabs (optional)
  useEffect(() => {
    const syncUser = () => setUser(getCurrentUser());
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  const isActive = (path) => location.pathname === path;

  const showStudentDash = user?.role === 1 || user?.role === 2;
  const showTutorDash = user?.role === 2;
  const showAdminDash = user?.role === 3;
  const isLoggedIn = !!user;

  const handleLogout = () => {
    localStorage.removeItem("demoUser");
    sessionStorage.removeItem("demoUser");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
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

            {/* Student Dashboard (role 1 or 2) */}
            {showStudentDash && (
              <Link
                to="/dashboard"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive("/dashboard")
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Student Dashboard</span>
              </Link>
            )}

            {/* Tutor Dashboard (role 2) */}
            {showTutorDash && (
              <Link
                to="/tutor/dashboard"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive("/tutor/dashboard")
                    ? "bg-green-600 text-white shadow-sm"
                    : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                }`}
              >
                <span className="font-bold text-lg">🎓</span>
                <span>Tutor Dashboard</span>
              </Link>
            )}

            {/* Admin Dashboard (role 3) */}
            {showAdminDash && (
              <Link
                to="/admin/dashboard"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive("/admin/dashboard")
                    ? "bg-purple-500 text-white shadow-sm"
                    : "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-100"
                }`}
              >
                <span className="font-bold text-lg">🛠️</span>
                <span>Admin Dashboard</span>
              </Link>
            )}

            {/* Logout when logged in */}
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-slate-900 text-white hover:bg-black transition"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
