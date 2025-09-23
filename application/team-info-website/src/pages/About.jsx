import { motion } from "framer-motion";
import { Mail, Github, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const TEAM = {
  name: "CSC648 Section04 Team04",
  term: "Fall 2025",
  location: "San Francisco State University",
  email: "team04@example.com",
  github: "https://github.com/CSC-648-SFSU/csc648-fa25-145-team04",
  site: "https://example.com",
};

const MEMBERS = [
  {
    name: "Iliana Gallegos",
    role: "Team-lead",
    bio: "Coordinates the team, ensures milestones are met, and bridges communication between front-end and back-end.",
    email: "igallegos@sfsu.edu",
  },
  {
    name: "Leigh Ann Apotheker",
    role: "Front-End lead",
    bio: "Guides the front-end team and oversees user interface development.",
    email: "lapothker@sfsu.edu",
  },
  {
    name: "Megha Rai",
    role: "Front-End Dev",
    bio: "Works on front-end features and contributes to building user interfaces.",
    email: "mrai@sfsu.edu",
  },
  {
    name: "Roxana Alicia Del Toro",
    role: "Front-End Dev",
    bio: "Supports front-end development and improves user experience.",
    email: "rxdt@sfsu.edu",
  },
  {
    name: "Darien C Sngoeun",
    role: "Back-End Lead",
    bio: "Leads the back-end team and coordinates server-side development.",
    email: "dsngoeun@sfsu.edu",
  },
  {
    name: "Jonathan Tsang",
    role: "Back-End Dev",
    bio: "Assists with back-end development and contributes to server logic.",
    email: "jtsang1@sfsu.edu",
  },
  {
    slug: "yuhang-wei",
    name: "Yuhang Wei",
    role: "GitHub Master",
    bio: "Manages the repository, branching workflow, and pull requests.",
    email: "ywei@sfsu.edu",
  },
];

export default function About() {
  return (
    <section className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-slate-200 bg-white p-6"
      >
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">About Us</h2>
        <p className="text-slate-600 mt-2">
          We are a collaborative learning group at SFSU focused on full‑stack web development.
          Our workflow emphasizes clear communication, short sprint cycles, and measurable deliverables.
          We meet weekly to plan, pair‑program, and review progress.
        </p>

        <dl className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 mt-4">
          <Item label="Team">{TEAM.name}</Item>
          <Item label="Term">{TEAM.term}</Item>
          <Item label="Location">{TEAM.location}</Item>
          <Item label="GitHub"><a className="hover:underline" href={TEAM.github} target="_blank">{TEAM.github}</a></Item>  
        </dl>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        <h3 className="text-xl font-semibold mb-2">Members</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MEMBERS.map((m) => (
            <motion.article
              key={m.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md"
            >
              <div className="h-14 w-14 rounded-xl bg-slate-900 text-white grid place-items-center font-bold mb-3">
                {m.name.split(" ").map(p => p[0]).join("")}
              </div>
              <div className="font-semibold leading-tight">
                {m.slug === "yuhang-wei" ? (
                  <Link to={`/member/${m.slug}`} className="text-blue-600 hover:underline">
                    {m.name}
                  </Link>
                ) : (
                  m.name
                )}
              </div>
              <div className="text-sm text-slate-500">{m.role}</div>
              <p className="text-sm mt-3 text-slate-700">{m.bio}</p>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <LinkPill href={`mailto:${m.email}`} icon={<Mail className="h-4 w-4" />}>Email</LinkPill>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function Item({ label, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-sm">{children}</div>
    </div>
  );
}

function LinkPill({ href, icon, children }) {
  return (
    <a href={href} className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-sm hover:bg-slate-50">
      {icon}
      <span>{children}</span>
    </a>
  );
}
