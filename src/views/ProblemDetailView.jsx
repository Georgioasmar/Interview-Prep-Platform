import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BookOpen, ChevronDown, ChevronUp, Code, Trophy, Lightbulb, Info, ChevronRight, ArrowLeft } from "lucide-react";
import { MOCK_PROBLEMS } from "../data/problems";
import { MathRenderer } from "../components/MathRenderer";

function HintAccordion({ hints }) {
  const [openHints, setOpenHints] = useState({});
  const toggle = (idx) => setOpenHints((prev) => ({ ...prev, [idx]: !prev[idx] }));

  return (
    <div className="space-y-3 pt-6">
      <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Strategy & Hints</h4>
      {hints.map((hint, idx) => (
        <div key={idx} className="border border-slate-800 rounded-lg overflow-hidden">
          <button
            onClick={() => toggle(idx)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/50 transition-colors"
          >
            <span className="text-sm font-medium flex items-center gap-2">
              <Lightbulb size={14} className="text-amber-500" /> Hint {idx + 1}
            </span>
            {openHints[idx] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {openHints[idx] && (
            <div className="px-4 pb-4 text-sm text-slate-400 animate-in slide-in-from-top-1 duration-200">
              <MathRenderer>{hint}</MathRenderer>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function AnswerSubmitter({ correctAnswer }) {
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const isCorrect = showResult && userAnswer.toLowerCase() === correctAnswer.toLowerCase();

  return (
    <div className="bg-[#0d0d0f] border border-slate-800 rounded-xl p-8">
      <form onSubmit={(e) => { e.preventDefault(); setShowResult(true); }} className="space-y-4">
        <label className="block text-sm font-bold text-slate-400 uppercase">
          Input Final Answer (Mathematical Expression)
        </label>
        <div className="flex gap-4">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="e.g. sqrt(pi), r*exp(sigma)..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono text-slate-200"
          />
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-lg font-bold transition-all">
            Submit
          </button>
        </div>
      </form>
      {showResult && (
        <div className={`mt-6 p-4 rounded-lg border flex items-center gap-4 ${isCorrect ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
          {isCorrect ? (
            <><Trophy size={24} /><div><p className="font-bold">Correct! Rigor Maintained.</p><p className="text-xs opacity-80">You've earned 50 Roumieh Points.</p></div></>
          ) : (
            <><Info size={24} /><div><p className="font-bold">Incorrect Answer.</p><p className="text-xs opacity-80">Refine your proof and try again.</p></div></>
          )}
        </div>
      )}
    </div>
  );
}

function TheoryPanel({ problem }) {
  return (
    <div className="bg-[#0d0d0f] border border-slate-800 rounded-xl sticky top-24">
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/30">
        <h3 className="font-bold flex items-center gap-2">
          <BookOpen size={18} className="text-indigo-400" /> Theory Reference
        </h3>
      </div>
      <div className="p-6 text-sm text-slate-400 leading-relaxed space-y-4">
        <p className="font-bold text-slate-200">Prerequisite Concepts:</p>
        <div className="p-4 bg-indigo-500/5 border-l-2 border-indigo-500 rounded-r-lg">
          <p className="italic text-xs">{problem.courseMaterial}</p>
        </div>
        <ul className="space-y-2 text-xs">
          <li className="flex items-center gap-2"><ChevronRight size={12} className="text-indigo-500" /> Integration by parts</li>
          <li className="flex items-center gap-2"><ChevronRight size={12} className="text-indigo-500" /> Measure Theory basics</li>
          <li className="flex items-center gap-2"><ChevronRight size={12} className="text-indigo-500" /> Change of variables (R^n)</li>
        </ul>
        <button className="w-full mt-4 text-xs bg-slate-800 hover:bg-slate-700 py-2 rounded transition-colors text-slate-300">
          Open Full Lecture Notes
        </button>
      </div>
    </div>
  );
}

export function ProblemDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const problem = MOCK_PROBLEMS.find((p) => p.id === Number(id));

  if (!problem) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-500">
        <p className="text-xl font-bold mb-4">Problem not found.</p>
        <button onClick={() => navigate("/problems")} className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300">
          <ArrowLeft size={16} /> Back to problems
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="lg:col-span-8 space-y-6">
        <button onClick={() => navigate("/problems")} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-2">
          <ArrowLeft size={16} /> Back to problems
        </button>
        <div className="bg-[#0d0d0f] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/30">
            <h2 className="font-bold flex items-center gap-2 text-slate-100">
              <Code size={18} className="text-indigo-500" /> Challenge Description
            </h2>
            <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-1 rounded">
              {problem.category}
            </span>
          </div>
          <div className="p-8 space-y-6">
            <h1 className="text-2xl font-bold">{problem.title}</h1>
            <div className="text-slate-300 leading-relaxed text-lg border-l-4 border-indigo-600 pl-4 bg-indigo-950/10 py-4">
              <MathRenderer>{problem.problemText}</MathRenderer>
            </div>
            {problem.context && (
              <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-lg">
                <h4 className="flex items-center gap-2 text-emerald-500 text-sm font-bold mb-2 uppercase tracking-widest">
                  <Info size={16} /> Conceptual Context
                </h4>
                <p className="text-slate-400 text-sm italic">{problem.context}</p>
              </div>
            )}
            <HintAccordion hints={problem.hints} />
          </div>
        </div>
        <AnswerSubmitter correctAnswer={problem.correctAnswer} />
      </div>
      <div className="lg:col-span-4">
        <TheoryPanel problem={problem} />
      </div>
    </div>
  );
}