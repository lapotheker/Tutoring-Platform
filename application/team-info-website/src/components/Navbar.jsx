import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b border-slate-200">
      <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-slate-900 text-white grid place-items-center font-semibold">04</div>
          <div>
            <div className="font-semibold leading-tight">CSC648 Section04 Team04</div>
            <div className="text-xs text-slate-500 -mt-0.5">Fall 2025</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Nav to="/">Home</Nav>
          <Nav to="/about">About</Nav>
        </div>
      </nav>
    </header>
  );
}

function Nav({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-1 rounded-full ${isActive ? "bg-slate-200 text-slate-900" : "text-slate-600 hover:bg-slate-100"}`
      }
    >
      {children}
    </NavLink>
  );
}
