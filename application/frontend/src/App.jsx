import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import { Routes, Route } from "react-router-dom";
import YuhangPage from "./pages/YuhangPage.jsx";
import LeighPage from "./pages/LeighPage.jsx";
import DarienPage from "./pages/DarienPage.jsx";
import MeghaPage from "./pages/MeghaPage.jsx";
import IlianaPage from "./pages/IlianaPage.jsx";
import RoxanaPage from "./pages/RoxanaPage.jsx";
import JonathanPage from "./pages/JonathanPage.jsx";
import BannerNotice from "./components/BannerNotice.jsx";
import TutorPolicy from "./pages/TutorPolicy.jsx";
import Login from "./pages/Login.jsx";
import RequestSession from "./pages/RequestSession.jsx";

// NEW: Tutor pages
import Tutor from "./pages/Tutor";
import TutorSearch from "./pages/TutorSearch";
import TutorApply from "./pages/TutorApply";

// ---------------------------
// Main App Component
// Includes Banner, NavBar, and Routes
// ---------------------------
export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
      <BannerNotice />
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Routes>
          {/* Home page route */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />

          {/* NEW: Tutor module */}
          <Route path="/tutor" element={<Tutor />} />
          <Route path="/tutor/search" element={<TutorSearch />} />
          <Route path="/tutor/apply" element={<TutorApply />} />
          <Route path="/tutor/policy" element={<TutorPolicy />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tutor/request/:id" element={<RequestSession />} />

          <Route path="/member/yuhang-wei" element={<YuhangPage />} />
          <Route path="/member/leigh-apotheker" element={<LeighPage />} />
          <Route path="/member/darien-sngoeun" element={<DarienPage />} />
          <Route path="/member/megha-rai" element={<MeghaPage />} />
          <Route path="/member/iliana-morales" element={<IlianaPage />} />
          <Route path="/member/roxana-del-toro" element={<RoxanaPage />} />
          <Route path="/member/jonathan-tsang" element={<JonathanPage />} />
        </Routes>
      </main>
      <footer className="mt-10 border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-500 flex flex-col md:flex-row items-center justify-between gap-3">
          <div>© {new Date().getFullYear()} CSC648 Section04 Team04. All rights reserved.</div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">📧 team04@example.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
