// -----------------------------
// SearchPage.jsx
// Simple prototype to connect frontend → backend → DB
// -----------------------------
import { useState } from "react";

// Base URL of your backend (defined in .env)
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle search click
  const handleSearch = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      // Example endpoint: http://localhost:3000/api/search?q=CSC648
      const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.items || []);
    } catch (err) {
      console.error("❌ Error fetching data:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text p-6">
      <h2 className="text-2xl font-bold mb-4">Search Tutors</h2>
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by course, subject, or language..."
          className="border border-muted rounded-2xl px-4 py-2 w-full
             bg-white text-black placeholder-gray-500
             focus:outline-none focus:ring-2 focus:ring-uno-blue"
        />
        <button
          type="submit"
          className="bg-uno-blue hover:bg-uno-green text-white px-4 py-2 rounded-2xl transition"
        >
          Search
        </button>
      </form>

      {loading && <p>Loading...</p>}

      <ul className="space-y-3">
        {results.map(tutor => (
          <li key={tutor.id} className="border border-muted rounded-xl p-4 shadow-soft">
            <div className="font-semibold text-lg">{tutor.name}</div>
            <div>Course: {tutor.course}</div>
            <div>Subject: {tutor.subject}</div>
            <div>Language: {tutor.language}</div>
          </li>
        ))}
        {!loading && results.length === 0 && <p className="text-muted">No results found.</p>}
      </ul>
    </div>
  );
}
