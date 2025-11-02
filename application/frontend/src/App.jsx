// src/App.jsx
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
import RegisterPage from "./pages/RegisterPage.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import SearchFilters from "./pages/SearchFilters.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import TutorProfile from "./pages/TutorProfile.jsx";
import MessageSent from "./pages/MessageSent.jsx";
import TutorDashboard from "./pages/TutorDashboard.jsx";
import TutorProfileSubmitted from "./pages/TutorProfileSubmitted.jsx";
import TutorDashboardApproved from "./pages/TutorDashboardApproved.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
      <BannerNotice />
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          {/* Student and Tutor Modules */}
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/tutor/policy" element={<TutorPolicy />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/tutor/request/:id" element={<RequestSession />} />
          <Route path="/search" element={<SearchFilters />} />
          <Route path="/filters" element={<SearchFilters />} /> {/* alias route */}
          <Route path="/results" element={<SearchResults />} />
          <Route path="/tutors/:id" element={<TutorProfile />} />
          <Route path="/message-sent" element={<MessageSent />} />
          <Route path="/tutor/dashboard" element={<TutorDashboard />} />
          <Route path="/tutor/profile-submitted" element={<TutorProfileSubmitted />} />
          <Route path="/tutor/dashboard-approved" element={<TutorDashboardApproved />} />
          {/* Team member pages */}
          <Route path="/member/yuhang-wei" element={<YuhangPage />} />
          <Route path="/member/leigh-apotheker" element={<LeighPage />} />
          <Route path="/member/darien-sngoeun" element={<DarienPage />} />
          <Route path="/member/megha-rai" element={<MeghaPage />} />
          <Route path="/member/iliana-morales" element={<IlianaPage />} />
          <Route path="/member/roxana-del-toro" element={<RoxanaPage />} />
          <Route path="/member/jonathan-tsang" element={<JonathanPage />} />
        </Routes>
      </main>

      {/* Footer */}
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
