import { Link, useLocation, useSearchParams } from "react-router-dom";

export default function MessageSent() {
  const { search } = useLocation();
  const [params] = useSearchParams();

  // Tutor name comes from query (?to=Sarah%20Garcia); fallback to generic label
  const toName = params.get("to") || "your tutor";

  const panel = "rounded-2xl border border-slate-300 bg-white p-6 shadow-sm";

  // Build a link back to search results, preserving any prior filters in the URL
  const backToResults = { pathname: "/results", search };

  return (
    <section className="max-w-4xl mx-auto space-y-6">
      <div className={panel}>
        <h1 className="text-xl md:text-2xl font-extrabold tracking-wide">
          MESSAGE SENT SUCCESSFULLY
        </h1>

        <div className="mt-4 rounded-xl border border-slate-300 bg-slate-50 p-4 text-slate-800">
          <p className="text-lg font-semibold">✓ Your message has been sent to {toName}</p>
          <p className="mt-1 text-sm md:text-base">
            The tutor will receive your message and can respond through the platform. Check your
            dashboard for replies.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            to={backToResults}
            className="inline-block rounded-md border px-5 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            BACK TO SEARCH
          </Link>

          <Link
            to="/dashboard"
            className="inline-block rounded-md border px-5 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            GO TO DASHBOARD
          </Link>
        </div>
      </div>
    </section>
  );
}
