import { Link } from "react-router-dom";
import avatar from "../assets/default-profile.jpg";

export default function Darien() {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <Link to="/about" className="text-sm text-slate-500 hover:underline">
          ← Back to About
        </Link>

        <div className="mt-4 flex flex-col md:flex-row items-start gap-6">
          <img
            src={avatar}
            alt="Darien Sngoeun"
            className="h-40 w-40 rounded-2xl object-cover border border-slate-200 shadow-sm"
          />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Darien Sngoeun</h1>
            <p className="text-slate-700 mt-4 max-w-prose">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora culpa laudantium rem
              eaque ea, itaque obcaecati esse nisi ipsa cum a illo, maiores excepturi quam? Minus ea
              enim deleniti magni?
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
