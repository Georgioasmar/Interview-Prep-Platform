import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Code, ExternalLink, Search, ChevronRight } from "lucide-react";
import { useCategory } from "../hooks/useCategory";
import { DifficultyBadge } from "../components/UI";
import { MathRenderer } from "../components/MathRenderer";

function ProblemsTab({ problems }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = problems.filter((p) => {
    const q = search.toLowerCase();
    if (!q) return true;
    if (p.title.toLowerCase().includes(q)) return true;
    if (p.tags?.some((t) => t.toLowerCase().includes(q))) return true;
    return false;
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or tag..."
          className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200 placeholder-slate-500"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-500 italic">No problems match your search.</div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0d0d0f]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Title</th>
                <th className="px-6 py-4 font-semibold">Difficulty</th>
                <th className="px-6 py-4 font-semibold">Tags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((prob) => (
                <tr
                  key={prob.id}
                  className="hover:bg-slate-800/30 cursor-pointer transition-colors group"
                  onClick={() => navigate(`/problems/${prob.id}`)}
                >
                  <td className="px-6 py-4 font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                    <MathRenderer>{prob.title}</MathRenderer>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <DifficultyBadge difficulty={prob.difficulty} />
                  </td>
                  <td className="px-6 py-4 flex gap-2 flex-wrap">
                    {prob.tags?.map((t) => (
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
      )}
    </div>
  );
}

function ResourcesTab({ category }) {
  // Structure ready for future content: courses, material, links
  const resources = {
    courses: [],       // { title, provider, url, description }
    material: [],      // { title, type, url, description }
    links: [],         // { title, url, description }
  };

  const isEmpty =
    resources.courses.length === 0 &&
    resources.material.length === 0 &&
    resources.links.length === 0;

  return (
    <div className="space-y-8">
      {/* About this category */}
      <div className="p-6 rounded-xl border border-slate-800 bg-[#0d0d0f]">
        <h3 className="font-bold text-slate-200 mb-2 flex items-center gap-2">
          <BookOpen size={18} className="text-indigo-400" /> About {category.name}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed">{category.description}</p>
      </div>

      {/* Courses — placeholder */}
      <div>
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
          Recommended Courses
        </h3>
        {resources.courses.length === 0 ? (
          <div className="p-6 rounded-xl border border-dashed border-slate-800 text-center text-slate-600 text-sm italic">
            Courses coming soon.
          </div>
        ) : (
          <div className="space-y-3">
            {resources.courses.map((c, i) => (
              <a key={i} href={c.url} target="_blank" rel="noreferrer"
                className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-[#0d0d0f] hover:border-slate-600 transition-colors group">
                <div>
                  <p className="font-bold text-slate-200 group-hover:text-indigo-400">{c.title}</p>
                  <p className="text-xs text-slate-500">{c.provider} · {c.description}</p>
                </div>
                <ExternalLink size={16} className="text-slate-600 group-hover:text-indigo-400" />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Study Material — placeholder */}
      <div>
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
          Study Material
        </h3>
        {resources.material.length === 0 ? (
          <div className="p-6 rounded-xl border border-dashed border-slate-800 text-center text-slate-600 text-sm italic">
            Material coming soon.
          </div>
        ) : (
          <div className="space-y-3">
            {resources.material.map((m, i) => (
              <a key={i} href={m.url} target="_blank" rel="noreferrer"
                className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-[#0d0d0f] hover:border-slate-600 transition-colors group">
                <div>
                  <p className="font-bold text-slate-200 group-hover:text-indigo-400">{m.title}</p>
                  <p className="text-xs text-slate-500">{m.type} · {m.description}</p>
                </div>
                <ExternalLink size={16} className="text-slate-600 group-hover:text-indigo-400" />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Relevant Links — placeholder */}
      <div>
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
          Relevant Links
        </h3>
        {resources.links.length === 0 ? (
          <div className="p-6 rounded-xl border border-dashed border-slate-800 text-center text-slate-600 text-sm italic">
            Links coming soon.
          </div>
        ) : (
          <div className="space-y-3">
            {resources.links.map((l, i) => (
              <a key={i} href={l.url} target="_blank" rel="noreferrer"
                className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-[#0d0d0f] hover:border-slate-600 transition-colors group">
                <div>
                  <p className="font-bold text-slate-200 group-hover:text-indigo-400">{l.title}</p>
                  <p className="text-xs text-slate-500">{l.description}</p>
                </div>
                <ExternalLink size={16} className="text-slate-600 group-hover:text-indigo-400" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function CategoryView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("problems");
  const { category, problems, loading, error } = useCategory(id);

  if (loading) return (
    <div className="flex justify-center py-32">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error || !category) return (
    <div className="text-center py-20 text-slate-500">
      <p className="text-xl font-bold mb-4">Category not found.</p>
      <button onClick={() => navigate(-1)} className="text-sm text-indigo-400 hover:text-indigo-300">Go back</button>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-10 p-8 rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/50 to-[#0d0d0f]">
        <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-300 text-sm flex items-center gap-2 mb-6 transition-colors">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 bg-indigo-500/10 rounded-xl">
            <Code size={28} className="text-indigo-400" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-100">{category.name}</h1>
        </div>
        <p className="text-slate-400 leading-relaxed max-w-3xl">{category.description}</p>
        <div className="mt-4 flex items-center gap-3 text-sm text-slate-500">
          <span className="px-3 py-1 bg-slate-800 rounded-full">{problems.length} problem{problems.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-slate-800 mb-8">
        {["problems", "resources"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors relative ${activeTab === tab ? "text-indigo-400" : "text-slate-500 hover:text-slate-300"}`}
          >
            {tab === "problems" ? "Problems" : "Resources & Material"}
            {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full" />}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {activeTab === "problems" && <ProblemsTab problems={problems} />}
        {activeTab === "resources" && <ResourcesTab category={category} />}
      </div>
    </div>
  );
}