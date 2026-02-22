import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useProblems(enabled) {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) return;
    setLoading(true);
    setError(null);

    supabase
      .from("problems")
      .select(`
        *,
        hints(order, text),
        problem_tags(tags(name)),
        problem_categories(categories(name, id))
      `)
      .order("title")
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
        } else {
          const normalized = data.map((p) => ({
            ...p,
            tags: p.problem_tags.map((pt) => pt.tags.name),
            categories: p.problem_categories.map((pc) => ({
              id: pc.categories.id,
              name: pc.categories.name,
            })),
            hints: p.hints
              .sort((a, b) => a.order - b.order)
              .map((h) => h.text),
          }));
          setProblems(normalized);
        }
        setLoading(false);
      });
  }, [enabled]);

  return { problems, loading, error };
}