// src/pages/TutorProfileSubmitted.jsx
import { Link } from "react-router-dom";

export default function TutorProfileSubmitted() {
  const panel = "rounded-2xl border border-slate-300 bg-white p-6 shadow-sm";

  return (
    <section className="max-w-3xl mx-auto">
      <div className={panel}>
        <div className="flex justify-end">
          <Link
            to="/tutor/dashboard"
            className="rounded-md border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            BACK TO DASHBOARD
          </Link>
        </div>

        <div className="mt-2 rounded-xl border border-slate-300 bg-slate-50 p-4 text-slate-800">
          <p className="font-extrabold">✓ YOUR TUTOR PROFILE HAS BEEN SUBMITTED</p>
          <p className="mt-1">Your profile is now under review by our administrators.</p>
          <p className="mt-1">This process typically takes 1–2 business days.</p>
          <p className="mt-1">
            You will receive an email notification when your profile is approved or if any changes
            are needed.
          </p>
          <p className="mt-2 font-semibold">Status: PENDING ADMIN REVIEW</p>
        </div>
      </div>
    </section>
  );
}
