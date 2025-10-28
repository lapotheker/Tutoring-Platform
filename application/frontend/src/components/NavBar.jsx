import { Link, NavLink } from "react-router-dom";

// Navigation bar component displayed at the top of all pages
export default function NavBar() {
  // Define a reusable style for navigation links
  const linkClass = isActive =>
    `px-3 py-1 rounded-2xl transition ${
      isActive ? "bg-uno-blue/40 underline" : "hover:bg-white/10"
    }`;

  return (
    <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur shadow-soft">
      <div className="max-w-6xl mx-auto h-14 px-4 flex items-center justify-between">
        {/* Left side — project logo and home link */}
        <Link to="/" className="font-semibold text-lg tracking-wide">
          SFSU Tutor
        </Link>

        {/* Right side — navigation links */}
        <nav className="flex items-center gap-3 text-sm">
          {/* Home page link */}
          <NavLink to="/" className={({ isActive }) => linkClass(isActive)}>
            Home
          </NavLink>

          {/* Search page link */}
          <NavLink to="/search" className={({ isActive }) => linkClass(isActive)}>
            Search
          </NavLink>

          {/* Login page link */}
          <NavLink to="/login" className={({ isActive }) => linkClass(isActive)}>
            Login
          </NavLink>

          {/* Sign-up page link */}
          <NavLink to="/signup" className={({ isActive }) => linkClass(isActive)}>
            Sign Up
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
