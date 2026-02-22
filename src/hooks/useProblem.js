import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useProblem(id) {
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    supabase
      .from("problems")
      .select(`
        *,
        hints(order, text),
        problem_tags(tags(name)),
        problem_categories(categories(name, id))
      `)
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
        } else {
          setProblem({
            ...data,
            tags: data.problem_tags.map((pt) => pt.tags.name),
            categories: data.problem_categories.map((pc) => ({
              id: pc.categories.id,
              name: pc.categories.name,
            })),
            hints: data.hints
              .sort((a, b) => a.order - b.order)
              .map((h) => h.text),
          });
        }
        setLoading(false);
      });
  }, [id]);

  return { problem, loading, error };
}