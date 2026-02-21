import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <nav className="border-b border-slate-800 bg-[#0d0d0f]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white">
              R
            </div>
            ROUMIEH<span className="text-indigo-500">QUANT</span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-400">
            <Link to="/interviews" className="hover:text-white transition-colors">Interviews</Link>
            <Link to="/problems" className="hover:text-white transition-colors">Problems</Link>
            <button className="hover:text-white transition-colors">Leaderboard</button>
            <button className="hover:text-white transition-colors">Courses</button>
          </div>
        </div>
        <button className="text-sm bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-md transition-all">
          Sign In
        </button>
      </div>
    </nav>
  );
}