import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useInterviewProblems(problemFilter) {
  const [problems, setProblems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!problemFilter?.tags?.length) return;
    setLoading(true);

    supabase
      .from("problem_tags")
      .select(`
        problems(
          *,
          hints(order, text),
          problem_tags(tags(name)),
          problem_categories(categories(name, id))
        ),
        tags!inner(name)
      `)
      .in("tags.name", problemFilter.tags)
      .then(({ data, error }) => {
        if (!error && data) {
          const seen = new Set();
          const normalized = data
            .map((row) => row.problems)
            .filter((p) => {
              if (!p || seen.has(p.id)) return false;
              seen.add(p.id);
              return true;
            })
            .map((p) => ({
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

          // unique categories with id preserved for navigation
          const catMap = new Map();
          normalized.forEach((p) =>
            p.categories.forEach((c) => catMap.set(c.id, c))
          );
          setProblems(normalized);
          setCategories([...catMap.values()]);
        }
        setLoading(false);
      });
  }, [problemFilter]);

  return { problems, categories, loading };
}