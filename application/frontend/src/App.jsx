// src/App.jsx
import Navbar from "./components/NavBar.jsx";
import BannerNotice from "./components/BannerNotice.jsx";
import { Routes, Route } from "react-router-dom";

// Public pages
import Home from "./pages/public/Home.jsx";
import About from "./pages/public/About.jsx";
import Login from "./pages/public/Login.jsx";
import RegisterPage from "./pages/public/Register.jsx";

// Search results
import SearchResults from "./pages/search/SearchResults.jsx";

// Student pages
import RequestSession from "./pages/student/RequestSession.jsx";
import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import StudentMessages from "./pages/student/StudentMessages.jsx"; // NEW
import MessageSent from "./pages/student/MessageSent.jsx";

// Tutor pages
import TutorDashboard from "./pages/tutor/TutorDashboard.jsx";
import TutorDashboardApproved from "./pages/tutor/TutorDashboardApproved.jsx";
import TutorPolicy from "./pages/tutor/TutorPolicy.jsx";
import TutorProfile from "./pages/tutor/TutorProfile.jsx";
import TutorProfileSubmitted from "./pages/tutor/TutorProfileSubmitted.jsx";

// Team member pages
import DarienPage from "./pages/team/DarienPage.jsx";
import IlianaPage from "./pages/team/IlianaPage.jsx";
import JonathanPage from "./pages/team/JonathanPage.jsx";
import LeighPage from "./pages/team/LeighPage.jsx";
import MeghaPage from "./pages/team/MeghaPage.jsx";
import RoxanaPage from "./pages/team/RoxanaPage.jsx";
import YuhangPage from "./pages/team/YuhangPage.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
      <BannerNotice />
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Student and Tutor Modules */}
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/tutor/policy" element={<TutorPolicy />} />
          <Route path="/tutor/request/:id" element={<RequestSession />} />
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