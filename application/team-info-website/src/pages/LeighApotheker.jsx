import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";

const MEMBER = {
  name: "Leigh Apotheker",
  role: "Front-End Lead",
  bio: "Guides the front-end team and oversees user interface development.",
  email: "lapothker@sfsu.edu",
  slug: "leigh-apotheker"
};

export default function LeighApotheker() {
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Team
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="h-32 w-32 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white grid place-items-center font-bold text-4xl flex-shrink-0">
              LA
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                {MEMBER.name}
              </h1>
              <p className="text-xl text-blue-600 font-medium mt-2">
                {MEMBER.role}
              </p>
              <p className="text-slate-600 mt-4 leading-relaxed">
                {MEMBER.bio}
              </p>
              <div className="mt-6">
                <LinkButton href={`mailto:${MEMBER.email}`} icon={<Mail className="h-4 w-4" />}>
                  Email Me
                </LinkButton>
              </div>
            </div>
          </div>
        </motion.div>


      </div>
    </div>
  );
}

function LinkButton({ href, icon, children }) {
  return (
    <a 
      href={href}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 font-medium"
    >
      {icon}
      <span>{children}</span>
    </a>
  );
}