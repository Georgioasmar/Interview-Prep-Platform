import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, ChevronRight, Layers, Code, MessageSquare, Pin, Users } from "lucide-react";
import { MOCK_INTERVIEWS } from "../data/interviews";
import { useInterviewProblems } from "../hooks/useInterviewProblems";

export function InterviewDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("practice");
  const track = MOCK_INTERVIEWS[id];
  const { problems, categories, loading } = useInterviewProblems(track?.problemFilter);

  if (!track) {
    return (
      <div className="text-center py-20 text-slate-500">
        <p className="text-xl font-bold mb-4">Track not found.</p>
        <button onClick={() => navigate("/interviews")} className="text-sm text-indigo-400 hover:text-indigo-300">
          Back to tracks
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="mb-10 p-8 rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/50 to-[#0d0d0f]">
        <button onClick={() => navigate("/interviews")} className="text-slate-500 hover:text-slate-300 text-sm flex items-center gap-2 mb-6 transition-colors">
          <ChevronRight className="rotate-180" size={16} /> Back to Tracks
        </button>
        <h1 className="text-4xl font-extrabold mb-4 text-slate-100">{track.title}</h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl mb-8">{track.description}</p>
        {track.subTypes.length > 0 && (
          <div>
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Layers size={16} /> Sub-Tracks
            </h4>
            <div className="flex flex-wrap gap-3">
              {track.subTypes.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => navigate(`/interviews/${sub.id}`)}
                  className="px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
                >
                  {sub.title} <ArrowRight size={14} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-8 border-b border-slate-800 mb-8">
        {["practice", "discussions"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors relative ${activeTab === tab ? "text-indigo-400" : "text-slate-500 hover:text-slate-300"}`}
          >
            {tab === "practice" ? "Practice Sets" : "Tips & Discussions"}
            {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full" />}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {activeTab === "practice" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-20 rounded-xl bg-slate-900/50 animate-pulse" />
                ))}
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-12 text-slate-500 italic">No problems available for this track yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((cat) => {
                  const count = problems.filter((p) => p.category === cat).length;
                  return (
                    <div
                      key={cat}
                      onClick={() => navigate(`/problems?category=${cat}`)}
                      className="flex items-center justify-between p-5 rounded-xl border border-slate-800 bg-[#0d0d0f] hover:border-slate-600 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 transition-colors">
                          <Code size={20} />
                        </div>
                        <div>
                          <span className="font-bold text-slate-200 block">{cat}</span>
                          <span className="text-xs text-slate-500">{count} problem{count !== 1 ? "s" : ""}</span>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-slate-600 group-hover:text-indigo-500 transition-colors" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "discussions" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-slate-500">Community insights and interview experiences.</p>
              <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-md text-sm font-bold transition-colors">
                New Discussion
              </button>
            </div>
            {track.discussions.length === 0 ? (
              <div className="text-center py-12 text-slate-500 italic bg-[#0d0d0f] rounded-xl border border-slate-800">
                No discussions yet. Be the first to start one!
              </div>
            ) : (
              track.discussions.map((disc) => (
                <div key={disc.id} className="flex items-start gap-4 p-5 rounded-xl border border-slate-800 bg-[#0d0d0f] hover:bg-slate-900/50 transition-colors cursor-pointer group">
                  <div className="mt-1">
                    {disc.isPinned ? <Pin size={18} className="text-amber-500" /> : <MessageSquare size={18} className="text-slate-600 group-hover:text-indigo-400" />}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold text-lg mb-1 ${disc.isPinned ? "text-slate-100" : "text-slate-300"}`}>
                      {disc.title}
                    </h4>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Users size={12} /> {disc.author}</span>
                      <span>{disc.replies} replies</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}