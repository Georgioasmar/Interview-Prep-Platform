import { useNavigate } from "react-router-dom";
import { BookOpen, Trophy, Terminal, ArrowRight } from "lucide-react";

function FeatureCard({ icon: Icon, title, desc, colorClass }) {
  return (
    <div className="p-6 rounded-xl border border-slate-800 bg-[#0d0d0f] text-left hover:border-slate-600 transition-colors">
      <div className="mb-4">
        <Icon className={colorClass} size={24} />
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

export function HomeView() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center text-center py-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-6">
        <Trophy size={14} /> THE ELITE SELECTION FOR PREPA & QUANT
      </div>
      <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white via-slate-300 to-slate-500 bg-clip-text text-transparent">
        Master Mathematical Rigor.
      </h2>
      <p className="max-w-2xl text-slate-400 text-lg mb-10 leading-relaxed">
        The definitive platform for Mines-Ponts, Polytechnique (X), and ENS
        candidates. Battle through the world's hardest integrals, proofs, and
        stochastic challenges.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={() => navigate("/problems")}
          className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold flex items-center gap-2 transition-all transform hover:scale-105"
        >
          Explore Challenges <ArrowRight size={20} />
        </button>
        <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold transition-all">
          View Leaderboard
        </button>
      </div>
      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        <FeatureCard icon={BookOpen} title="X-ENS Rigor" desc="Questions curated from real Oral Exams (Oraux) and the legendary Cassini collections." colorClass="text-indigo-500" />
        <FeatureCard icon={Terminal} title="Quant Prep" desc="Stochastic calculus and probability brainteasers tailored for MVA/El Karoui aspirants." colorClass="text-emerald-500" />
        <FeatureCard icon={Trophy} title="Roumieh Spirit" desc="Competitive leaderboards and peer-reviewed proofs to sharpen your intuition." colorClass="text-amber-500" />
      </div>
    </div>
  );
}