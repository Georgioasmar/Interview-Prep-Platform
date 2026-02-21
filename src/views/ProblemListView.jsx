import { useNavigate } from "react-router-dom";
import { useProblems } from "../hooks/useProblems";
import { DifficultyBadge } from "../components/UI";

function SkeletonRows() {
  return [1, 2, 3].map((i) => (
    <tr key={i} className="animate-pulse">
      <td colSpan="5" className="px-6 py-8 bg-slate-900/20" />
    </tr>
  ));
}

export function ProblemListView() {
  const navigate = useNavigate();
  const { problems, loading } = useProblems(true);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-8">
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
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0d0d0f]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Title</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold">Difficulty</th>
              <th className="px-6 py-4 font-semibold">Tags</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? <SkeletonRows /> : problems.map((prob) => (
              <tr
                key={prob.id}
                className="hover:bg-slate-800/30 cursor-pointer transition-colors group"
                onClick={() => navigate(`/problems/${prob.id}`)}
              >
                <td className="px-6 py-4">
                  <div className="w-4 h-4 border-2 border-slate-700 rounded-full" />
                </td>
                <td className="px-6 py-4 font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                  {prob.id}. {prob.title}
                </td>
                <td className="px-6 py-4 text-slate-400 text-sm">{prob.category}</td>
                <td className="px-6 py-4 text-sm">
                  <DifficultyBadge difficulty={prob.difficulty} />
                </td>
                <td className="px-6 py-4 flex gap-2">
                  {prob.tags.map((t) => (
                    <span key={t} className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase">
                      {t}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}