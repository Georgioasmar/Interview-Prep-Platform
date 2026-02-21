import { useNavigate } from "react-router-dom";
import { Briefcase, ArrowRight } from "lucide-react";
import { MOCK_INTERVIEWS, MAIN_TRACKS } from "../data/interviews";

export function InterviewsListView() {
  const navigate = useNavigate();
  const mainTracks = MAIN_TRACKS.map((id) => MOCK_INTERVIEWS[id]);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Interview Tracks</h2>
        <p className="text-slate-500">Select your target industry to access curated roadmaps, problems, and discussions.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mainTracks.map((track) => (
          <div
            key={track.id}
            onClick={() => navigate(`/interviews/${track.id}`)}
            className="group cursor-pointer p-6 rounded-xl border border-slate-800 bg-[#0d0d0f] hover:border-indigo-500/50 hover:bg-slate-900/50 transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400 group-hover:scale-110 transition-transform">
                <Briefcase size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">
                {track.title}
              </h3>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mb-6 h-16 overflow-hidden">
              {track.description}
            </p>
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>{track.problemFilter.tags.length} Topics</span>
              <span className="flex items-center gap-1 group-hover:text-indigo-400 transition-colors">
                Explore Track <ArrowRight size={14} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}