import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useProblems } from "../hooks/useProblems";
import { DifficultyBadge } from "../components/UI";

function SkeletonRows() {
  return [1, 2, 3].map((i) => (
    <tr key={i} className="animate-pulse">
      <td colSpan="4" className="px-6 py-8 bg-slate-900/20" />
    </tr>
  ));
}

export function ProblemListView() {
  const navigate = useNavigate();
  const { problems, loading } = useProblems(true);
  const [search, setSearch] = useState("");

  const filtered = problems.filter((p) => {
    const q = search.toLowerCase();
    if (!q) return true;
    if (p.title.toLowerCase().includes(q)) return true;
    if (p.tags?.some((t) => t.toLowerCase().includes(q))) return true;
    return false;
  });

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-bold">Problem Set</h2>
          <p className="text-slate-500">Select a challenge to begin your rigorous training.</p>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded">Easy</span>
          <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded">Medium</span>
          <span className="px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded">Hard</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or tag..."
          className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200 placeholder-slate-500"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0d0d0f]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Title</th>
              <th className="px-6 py-4 font-semibold">Categories</th>
              <th className="px-6 py-4 font-semibold">Difficulty</th>
              <th className="px-6 py-4 font-semibold">Tags</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? <SkeletonRows /> : filtered.map((prob) => (
              <tr
                key={prob.id}
                className="hover:bg-slate-800/30 cursor-pointer transition-colors group"
                onClick={() => navigate(`/problems/${prob.id}`)}
              >
                <td className="px-6 py-4 font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                  {prob.title}
                </td>
                <td className="px-6 py-4 text-slate-400 text-sm">
                  {prob.categories?.map((c) => c.name).join(", ")}
                </td>
                <td className="px-6 py-4 text-sm">
                  <DifficultyBadge difficulty={prob.difficulty} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2 flex-wrap">
                    {prob.tags?.map((t) => (
                      <span key={t} className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase">
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}