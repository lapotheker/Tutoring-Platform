import { Mail } from "lucide-react";
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
    slug: "iliana-morales",
    name: "Iliana Gallegos",
    role: "Team-lead",
    bio: "Coordinates the team, ensures milestones are met, and bridges communication between front-end and back-end.",
    email: "igallegos@sfsu.edu",
  },
  {
    slug: "leigh-apotheker",
    name: "Leigh Apotheker",
    role: "Front-End lead",
    bio: "Guides the front-end team and oversees user interface development.",
    email: "lapothker@sfsu.edu",
  },
  {
    slug: "megha-rai",
    name: "Megha Rai",
    role: "Front-End Dev",
    bio: "Works on front-end features and contributes to building user interfaces.",
    email: "mrai@sfsu.edu",
  },
  {
    slug: "darien-sngoeun",
    name: "Darien C Sngoeun",
    role: "Back-End Lead",
    bio: "Leads the back-end team and coordinates server-side development.",
    email: "dsngoeun@sfsu.edu",
  },
  {
    slug: "jonathan-tsang",
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
  {
    slug: "roxana-del-toro",
    name: "Roxana del Toro",
    role: "Back-End Dev",
    bio: "Develops on the backend part of the stack and helps with infrastructure.",
    email: "rxdt@sfsu.edu",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 px-4 py-12">
      <section className="space-y-8 max-w-7xl mx-auto">
        <div className="rounded-3xl border-2 border-purple-200 bg-white/95 backdrop-blur-sm p-8 shadow-2xl shadow-purple-200/50 transform hover:shadow-3xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-lg ring-2 ring-amber-400">
              <span className="text-xl font-bold text-white leading-none tracking-tighter" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                SG
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
              About Us
            </h2>
          </div>
          
          <p className="text-slate-700 mt-4 text-lg">
            We are a collaborative learning group at SFSU focused on full‑stack web development. Our
            workflow emphasizes clear communication, short sprint cycles, and measurable deliverables.
            We meet weekly to plan, pair‑program, and review progress.
          </p>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 mt-6">
            <Item label="Team">{TEAM.name}</Item>
            <Item label="Term">{TEAM.term}</Item>
            <Item label="Location">{TEAM.location}</Item>
            <Item label="GitHub">
              <a className="text-purple-600 hover:text-purple-800 hover:underline font-medium" href={TEAM.github} target="_blank" rel="noopener noreferrer">
                View Repository →
              </a>
            </Item>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-purple-900 mb-6">Team Members</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MEMBERS.map((m, index) => (
              <Link
                key={m.name}
                to={`/member/${m.slug}`}
                className="block"
              >
                <article
                  className="rounded-2xl border-2 border-purple-200 bg-white/95 backdrop-blur-sm p-6 shadow-lg shadow-purple-100 hover:shadow-2xl hover:shadow-purple-200/50 hover:border-purple-300 transition-all transform hover:-translate-y-1 duration-300 cursor-pointer h-full"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 text-white grid place-items-center font-bold text-xl mb-4 shadow-lg ring-2 ring-amber-400">
                    {m.name
                      .split(" ")
                      .map((p) => p[0])
                      .join("")}
                  </div>

                  <div className="font-bold leading-tight text-lg">
                    <span className="text-purple-900">{m.name}</span>
                  </div>
                  <div className="text-sm font-semibold text-amber-600 mt-1">{m.role}</div>
                  <p className="text-sm mt-3 text-slate-700">{m.bio}</p>
                  <div className="mt-5 flex items-center gap-2 text-sm">
                    <LinkPill href={`mailto:${m.email}`} icon={<Mail className="h-4 w-4" />}>
                      Email
                    </LinkPill>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Item({ label, children }) {
  return (
    <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-white p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="text-xs uppercase tracking-wider font-bold text-purple-600">{label}</div>
      <div className="mt-1.5 text-sm text-slate-800 font-medium">{children}</div>
    </div>
  );
}

function LinkPill({ href, icon, children }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-1.5 rounded-full border-2 border-purple-300 bg-purple-50 px-4 py-1.5 text-sm font-semibold text-purple-700 hover:bg-purple-100 hover:border-purple-400 transition-all shadow-sm hover:shadow-md"
      onClick={(e) => e.stopPropagation()}
    >
      {icon}
      <span>{children}</span>
    </a>
  );
}