import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import { Routes, Route } from "react-router-dom";
import YuhangPage from "./pages/YuhangPage";
import LeighPage from "./pages/LeighPage";
import DarienPage from "./pages/DarienPage";
import MeghaPage from "./pages/MeghaPage";
import IlianaPage from "./pages/IlianaPage.jsx";
import RoxanaPage from "./pages/RoxanaPage.jsx";
import JonathanPage from "./pages/JonathanPage.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
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
