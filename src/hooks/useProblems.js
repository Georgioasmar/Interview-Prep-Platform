import { useState, useEffect } from "react";
import { MOCK_PROBLEMS } from "../data/problems";

export function useProblems(enabled) {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    const timer = setTimeout(() => {
      try {
        setProblems(MOCK_PROBLEMS);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [enabled]);

  return { problems, loading, error };
}