import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { HomeView } from "./views/HomeView";
import { ProblemListView } from "./views/ProblemListView";
import { ProblemDetailView } from "./views/ProblemDetailView";
import { InterviewsListView } from "./views/InterviewsListView";
import { InterviewDetailView } from "./views/InterviewDetailView";

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-200 font-sans selection:bg-indigo-500/30">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/problems" element={<ProblemListView />} />
          <Route path="/problems/:id" element={<ProblemDetailView />} />
          <Route path="/interviews" element={<InterviewsListView />} />
          <Route path="/interviews/:id" element={<InterviewDetailView />} />
        </Routes>
      </main>
    </div>
  );
}