// App.jsx
// Main app shell with top banner, navbar, and route configuration.

import { Routes, Route, Link } from "react-router-dom";
import NavBar from "./components/NavBar";
import BannerNotice from "./components/BannerNotice";
import SearchPage from "./pages/SearchPage"; // ← use the real SearchPage component

// ---------------------------
// Home Page Component
// ---------------------------
function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg text-text">
      {/* Project banner with course info (required course disclaimer) */}
      <div className="bg-uno-blue/20 text-center py-2 px-6 rounded-2xl mb-6 text-sm shadow-soft">
        SFSU Software Engineering Project — CSC 648 / Fall 2025
      </div>

      {/* Welcome heading */}
      <h1 className="text-4xl font-bold mb-4">Welcome to SFSU Tutor 🎓</h1>

      {/* Instructional text */}
      <p className="text-muted mb-8">
        If you see this centered text with colored background, Tailwind works!
      </p>

      {/* Navigation link to Search page (use Link to avoid full page reload) */}
      <Link
        to="/search"
        className="bg-uno-blue hover:bg-uno-green text-white font-semibold py-2 px-6 rounded-2xl shadow-soft transition"
      >
        Go to Search
      </Link>
    </div>
  );
}

// ---------------------------
// Main App Component
// Includes Banner, NavBar, and Routes
// ---------------------------
export default function App() {
  return (
    <div className="min-h-screen">
      {/* Top banner for course info */}
      <BannerNotice />

      {/* Navigation bar */}
      <NavBar />

      {/* Main routes for the app */}
      <main>
        <Routes>
          {/* Home page route */}
          <Route path="/" element={<Home />} />

          {/* Search page route — now uses the real SearchPage */}
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </main>
    </div>
  );
}
