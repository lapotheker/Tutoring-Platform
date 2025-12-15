import { Link, useLocation, useSearchParams } from "react-router-dom";

export default function MessageSent() {
  const { search } = useLocation();
  const [params] = useSearchParams();
  // Tutor name comes from query (?to=Sarah%20Garcia); fallback to generic label
  const toName = params.get("to") || "your tutor";
  
  // Build a link back to search results, preserving any prior filters in the URL
  const backToResults = { pathname: "/results", search };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 px-4 py-12">
      <section className="max-w-4xl mx-auto space-y-6">
        <div className="rounded-3xl border-2 border-purple-200 bg-white/95 backdrop-blur-sm p-8 shadow-2xl shadow-purple-200/50">
          <div className="flex items-center justify-center mb-6">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg ring-4 ring-amber-400">
              <span className="text-4xl">✓</span>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-center bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent mb-6">
            MESSAGE SENT SUCCESSFULLY
          </h1>
          
          <div className="rounded-2xl border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 p-6 text-center">
            <p className="text-xl font-bold text-green-900 mb-3">
              ✓ Your message has been sent to {toName}
            </p>
            <p className="text-base text-slate-700">
              The tutor will receive your message and can respond through the platform. Check your
              dashboard for replies.
            </p>
          </div>
          
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to={backToResults}
              className="inline-flex items-center justify-center rounded-xl border-2 border-purple-300 bg-white px-6 py-3 text-purple-700 font-bold hover:bg-purple-50 hover:border-purple-400 transition-all shadow-sm"
            >
              ← BACK TO SEARCH
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-3 text-white font-bold shadow-lg shadow-purple-200 hover:from-purple-700 hover:to-purple-800 hover:shadow-xl transition-all"
            >
              GO TO DASHBOARD →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}