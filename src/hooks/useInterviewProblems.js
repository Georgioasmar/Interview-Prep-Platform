import { useState, useEffect } from "react";
import { MOCK_PROBLEMS } from "../data/problems";

export function useInterviewProblems(problemFilter) {
  const [problems, setProblems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!problemFilter) return;
    setLoading(true);
    const timer = setTimeout(() => {
      const filtered = MOCK_PROBLEMS.filter((p) =>
        p.tags.some((tag) => problemFilter.tags.includes(tag))
      );
      const uniqueCategories = [...new Set(filtered.map((p) => p.category))];
      setProblems(filtered);
      setCategories(uniqueCategories);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [problemFilter]);

  return { problems, categories, loading };
}