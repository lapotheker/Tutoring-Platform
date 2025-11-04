// src/pages/search/SearchResults.jsx
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

// Demo dataset — replace with API results later
const SAMPLE = [
  {
    id: 1,
    name: "Sarah Garcia",
    title: "Graduate Teaching Assistant",
    rate: 25,
    courses: ["CSC 648"],
    languages: ["English", "Spanish"],
    availability: "Mon–Fri afternoons, Sat mornings",
  },
  {
    id: 2,
    name: "Namiko Turner",
    title: "Graduate Teaching Assistant",
    rate: 30,
    courses: ["CSC 648", "CSC 317"],
    languages: ["English"],
    availability: "Weekday evenings",
  },
];

export default function SearchResults() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  // ----- Read query params -----
  const q = params.get("q") || "";
  const subject = params.get("subject") || "";
  const course = params.get("course") || "";
  const rates = (params.get("rates") || "").split(",").filter(Boolean);
  const langs = (params.get("langs") || "").split(",").filter(Boolean);

  // ----- Filter demo data -----
  const filtered = useMemo(() => {
    return SAMPLE.filter((t) => {
      const text =
        `${t.name} ${t.title} ${t.courses.join(" ")} ${t.languages.join(" ")}`.toLowerCase();

      const qOk = !q || text.includes(q.toLowerCase());
      const subjectOk = !subject || text.includes(subject.toLowerCase());
      const courseOk =
        !course || t.courses.some((c) => c.toLowerCase().includes(course.toLowerCase()));

      const rateOk =
        !rates.length ||
        rates.some((r) => {
          if (r === "$0-20") return t.rate <= 20;
          if (r === "$21-40") return t.rate >= 21 && t.rate <= 40;
          if (r === "$41+") return t.rate >= 41;
          return true;
        });

      const langOk =
        !langs.length ||
        langs.some((l) => t.languages.map((x) => x.toLowerCase()).includes(l.toLowerCase()));

      return qOk && subjectOk && courseOk && rateOk && langOk;
    });
  }, [q, subject, course, rates, langs]);

  const showingLabel = filtered.length ? `Showing 1–${filtered.length}` : "Showing 0";
  const searchTitle = course || q || subject || "All";

  return (
    <section className="space-y-6">
      {/* ===== Header Bar ===== */}
      <div className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm text-center relative">
        {/* ← Back to Home */}
        <Link
          to="/"
          className="absolute left-6 top-6 text-slate-600 text-sm font-medium hover:text-blue-600"
        >
          ← Back to Home
        </Link>

        <h1 className="text-xl md:text-2xl font-extrabold tracking-wide">SFSU TUTORING PLATFORM</h1>

        {/* Centered search bar */}
        <div className="mt-4 flex justify-center">
          <div className="flex items-center gap-2 rounded-full border border-slate-300 pl-4 pr-2 py-2 w-full max-w-lg bg-white">
            <input
              type="text"
              defaultValue={q || course}
              placeholder="Search by keyword or course"
              className="flex-1 outline-none text-sm"
              readOnly
            />
            <div className="grid place-items-center h-9 w-9 rounded-full bg-slate-900 text-white">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Results Header ===== */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg md:text-xl font-extrabold">Search Results – "{searchTitle}"</h2>
          <div className="text-sm text-slate-600">{showingLabel}</div>
        </div>

        {/* ===== Result Cards ===== */}
        <div className="mt-4 space-y-5">
          {filtered.map((t) => (
            <article key={t.id} className="rounded border border-slate-300 bg-white p-4">
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-full bg-slate-200 grid place-items-center text-slate-600 text-xl">
                  👤
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="font-extrabold tracking-wide">{t.name.toUpperCase()}</h3>
                    <div className="font-semibold">${t.rate}/hour</div>
                  </div>

                  <div className="text-sm">
                    <div>{t.title}</div>
                    <div>Courses: {t.courses.join(", ")}</div>
                    <div>Languages: {t.languages.join(", ")}</div>
                    <div>Availability Summary: {t.availability}</div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Link
                      to={`/tutors/${t.id}${search}`}
                      className="inline-block rounded border px-4 py-1 text-sm font-medium hover:bg-slate-50"
                    >
                      VIEW PROFILE
                    </Link>

                    <Link
                      to={{
                        pathname: `/tutor/request/${t.id}`,
                        search: `?to=${encodeURIComponent(t.name)}${
                          search ? `&${search.slice(1)}` : ""
                        }`,
                      }}
                      className="inline-block rounded bg-slate-900 text-white px-4 py-1 text-sm font-medium hover:bg-black"
                    >
                      CONTACT
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="text-slate-600 text-center">
              No results found. Try adjusting your filters.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
