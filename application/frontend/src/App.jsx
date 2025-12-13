// src/App.jsx
import Navbar from "./components/NavBar.jsx";
import BannerNotice from "./components/BannerNotice.jsx";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Public pages
import Home from "./pages/public/Home.jsx";
import About from "./pages/public/About.jsx";
import Login from "./pages/public/Login.jsx";
import RegisterPage from "./pages/public/Register.jsx";

// Admin page
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";

// Search results
import SearchResults from "./pages/search/SearchResults.jsx";

// Student pages
import RequestSession from "./pages/student/RequestSession.jsx";
import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import MessageSent from "./pages/student/MessageSent.jsx";

// Tutor pages
import TutorDashboard from "./pages/tutor/TutorDashboard.jsx";
import TutorProfile from "./pages/tutor/TutorProfile.jsx";
import Posting from "./pages/tutor/Posting.jsx";
import EditTutorProfile from "./pages/tutor/EditTutorProfile.jsx";

// Team member pages
import DarienPage from "./pages/team/DarienPage.jsx";
import IlianaPage from "./pages/team/IlianaPage.jsx";
import JonathanPage from "./pages/team/JonathanPage.jsx";
import LeighPage from "./pages/team/LeighPage.jsx";
import MeghaPage from "./pages/team/MeghaPage.jsx";
import RoxanaPage from "./pages/team/RoxanaPage.jsx";
import YuhangPage from "./pages/team/YuhangPage.jsx";

function getCurrentUser() {
  try {
    return (
      JSON.parse(localStorage.getItem("demoUser")) || JSON.parse(sessionStorage.getItem("demoUser"))
    );
  } catch {
    return null;
  }
}

function ProtectedRoute({ allowedRoles, element }) {
  const location = useLocation();
  const user = getCurrentUser();
  if (!user) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return element;
}

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
      <BannerNotice />
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/results" element={<SearchResults />} />
          <Route path="/tutors/:id" element={<TutorProfile />} />

          {/* Student dashboard (roles 1=Student, 2=Tutor) */}
          <Route
            path="/dashboard"
            element={<ProtectedRoute allowedRoles={[1, 2]} element={<StudentDashboard />} />}
          />

          {/* Tutor dashboards (role 2) */}
          <Route
            path="/tutor/dashboard"
            element={<ProtectedRoute allowedRoles={[2]} element={<TutorDashboard />} />}
          />

          <Route
            path="/tutor/posting"
            element={<ProtectedRoute allowedRoles={[2]} element={<Posting />} />}
          />
          <Route
            path="/tutor/profile/edit"
            element={<ProtectedRoute allowedRoles={[2]} element={<EditTutorProfile />} />}
          />

          <Route
            path="/tutor/request/:id"
            element={<ProtectedRoute allowedRoles={[1, 2]} element={<RequestSession />} />}
          />
          <Route
            path="/message-sent"
            element={<ProtectedRoute allowedRoles={[1, 2]} element={<MessageSent />} />}
          />

          {/* Admin dashboard (role 3) */}
          <Route
            path="/admin"
            element={<ProtectedRoute allowedRoles={[3]} element={<AdminDashboard />} />}
          />

          {/* Team pages (public) */}
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
