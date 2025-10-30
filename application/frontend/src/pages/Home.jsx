import { motion } from "framer-motion";
import { GraduationCap, Users, CalendarDays, Mail, Github, Globe, Target } from "lucide-react";

const TEAM = {
  name: "CSC648 Section04 Team04",
  term: "Fall 2025",
  tagline: "We build practical solutions with clean design and solid engineering.",
  location: "San Francisco State University",
  email: "team04@example.com",
  github: "https://github.com/CSC-648-SFSU/csc648-fa25-145-team04",
  site: "https://example.com",
};

export default function Home() {
  return (
    <section className="pt-4 pb-10">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">{TEAM.name}</h1>
          <p className="mt-3 text-lg text-slate-600">{TEAM.tagline}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Badge icon={<GraduationCap className="h-6 w-6" />}>{TEAM.location}</Badge>
            <Badge icon={<Users className="h-6 w-6" />}>Learning Group</Badge>
            <Badge icon={<CalendarDays className="h-6 w-6" />}>{TEAM.term}</Badge>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="relative">
            <div className="absolute inset-0 -rotate-2 rounded-3xl bg-slate-200" />
            <div className="relative rounded-3xl bg-white shadow-xl p-6 border border-slate-200">
              <h3 className="font-semibold flex items-center gap-2">
                <Target className="h-4 w-4" />
                Our Focus
              </h3>
              <ul className="mt-3 text-sm list-disc pl-5 space-y-1 text-slate-700">
                <li>Deliver clean, maintainable code with peer reviews.</li>
                <li>Design user-centered interfaces informed by HCI.</li>
                <li>Ship iteratively with clear milestones and demos.</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Badge({ icon, children }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs rounded-full bg-white border border-slate-200 px-2 py-1 shadow-sm">
      {icon}
      {children}
    </span>
  );
}

function LinkPill({ href, icon, children }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-sm hover:bg-slate-50"
    >
      {icon}
      <span>{children}</span>
    </a>
  );
}
