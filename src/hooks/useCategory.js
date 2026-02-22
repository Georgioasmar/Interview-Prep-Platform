import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useCategory(categoryId) {
  const [category, setCategory] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categoryId) return;
    setLoading(true);

    supabase
      .from("categories")
      .select("*")
      .eq("id", categoryId)
      .single()
      .then(({ data: catData, error: catError }) => {
        if (catError) {
          setError(catError.message);
          setLoading(false);
          return;
        }
        setCategory(catData);

        supabase
          .from("problem_categories")
          .select("problem_id")
          .eq("category_id", categoryId)
          .then(({ data: pcData, error: pcError }) => {
            if (pcError || !pcData?.length) {
              setProblems([]);
              setLoading(false);
              return;
            }

            const problemIds = pcData.map((r) => r.problem_id);

            supabase
              .from("problems")
              .select(`
                *,
                hints(order, text),
                problem_tags(tags(name))
              `)
              .in("id", problemIds)
              .then(({ data: probData, error: probError }) => {
                if (!probError && probData) {
                  const normalized = probData.map((p) => ({
                    ...p,
                    tags: p.problem_tags.map((pt) => pt.tags.name),
                    categories: [],
                    hints: p.hints
                      .sort((a, b) => a.order - b.order)
                      .map((h) => h.text),
                  }));
                  setProblems(normalized);
                }
                setLoading(false);
              });
          });
      });
  }, [categoryId]);

  return { category, problems, loading, error };
}