// A simple banner displayed at the very top of the page.
// Used for showing course / project info (e.g., CSC 648, Fall 2025)

export default function BannerNotice() {
  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900 text-sm">
      <div className="mx-auto max-w-6xl px-4 py-2">
        <strong>Course Demo:</strong> This website is for CSC648/848 class demo only. No real
        payments. Some actions require an <code>@sfsu.edu</code> login.
      </div>
    </div>
  );
}
