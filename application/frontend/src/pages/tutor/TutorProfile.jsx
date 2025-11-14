import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { tutorAPI } from "../../services/api";

export default function TutorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { search } = useLocation();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tutor data from API
  useEffect(() => {
    async function fetchTutor() {
      setLoading(true);
      setError(null);

      try {
        const response = await tutorAPI.getTutorById(id);

        if (response.success) {
          setData(response.data);
        } else {
          setError("Tutor not found");
        }
      } catch (err) {
        console.error("Error fetching tutor:", err);
        setError("Failed to load tutor profile");
      } finally {
        setLoading(false);
      }
    }

    fetchTutor();
  }, [id]);

  const backHref = useMemo(() => ({ pathname: "/results", search }), [search]);

  // Loading state
  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
        <div className="text-sm text-slate-600">Loading tutor profile...</div>
      </section>
    );
  }

  // Error or not found
  if (error || !data) {
    return (
      <section className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
        <div className="text-sm text-slate-600">{error || "Tutor not found."}</div>
        <div className="mt-3">
          <Link to={backHref} className="text-blue-600 hover:underline">
            Back to Results
          </Link>
        </div>
      </section>
    );
  }

  function goContact() {
    const params = new URLSearchParams(search);
    params.set("to", data.display_name);
    navigate({
      pathname: `/tutor/request/${data.tutor_profile_id}`,
      search: `?${params.toString()}`,
    });
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
        <Link to={backHref} className="text-sm font-medium text-blue-600 hover:underline">
          &lt; BACK TO RESULTS
        </Link>

        {/* Header row */}
        <div className="mt-4 flex items-start gap-4">
          <div className="h-14 w-14 rounded-full bg-slate-200 grid place-items-center text-slate-600 text-2xl overflow-hidden">
            {data.profile_photo ? (
              <img
                src={data.profile_photo}
                alt={data.display_name}
                className="w-full h-full object-cover"
              />
            ) : (
              "👤"
            )}
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-wide">
              {data.display_name.toUpperCase()}
            </h1>
            <div className="text-sm text-slate-700">{data.full_name}</div>
          </div>
        </div>

        {/* Body */}
        <div className="mt-6 grid gap-4 max-w-2xl">
          <div>
            <div className="font-semibold">Hourly Rate</div>
            <div>${data.hourly_rate}/hour</div>
          </div>

          <div>
            <div className="font-semibold">Courses Covered</div>
            <div className="text-sm">{data.courses || "N/A"}</div>
          </div>

          <div>
            <div className="font-semibold">Subject Tags</div>
            <div className="text-sm">{data.subject_tags || "N/A"}</div>
          </div>

          <div>
            <div className="font-semibold">Languages Spoken</div>
            <div className="text-sm">{data.languages || "N/A"}</div>
          </div>

          <div>
            <div className="font-semibold">Availability Summary</div>
            <div className="text-sm whitespace-pre-wrap">{data.availability_summary}</div>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-6">
          <button
            onClick={goContact}
            className="rounded border px-4 py-2 font-semibold hover:bg-slate-50"
          >
            CONTACT
          </button>
        </div>
      </div>
    </section>
  );
}
