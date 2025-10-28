// A simple banner displayed at the very top of the page.
// Used for showing course / project info (e.g., CSC 648, Fall 2025)

export default function BannerNotice() {
  return (
    <div className="w-full bg-uno-blue/20 text-center py-2 text-sm text-text">
      SFSU Software Engineering Project — CSC 648 / Fall 2025. For Demonstration Only
    </div>
  );
}
