import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useInterviews() {
  const [interviews, setInterviews] = useState({});
  const [mainTracks, setMainTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("interviews")
      .select(`
        *,
        interview_categories(categories(id, name, description))
      `)
      .order("order")
      .then(({ data, error }) => {
        if (!error && data) {
          const map = Object.fromEntries(
            data.map((t) => [
              t.id,
              {
                ...t,
                subTypes: data
                  .filter((s) => s.parent_id === t.id)
                  .map((s) => ({ id: s.id, title: s.title })),
                problemFilter: { tags: t.filter_tags },
                categories: t.interview_categories.map((ic) => ic.categories),
                discussions: [],
              },
            ])
          );
          const mains = data
            .filter((t) => t.parent_id === null)
            .map((t) => t.id);
          setInterviews(map);
          setMainTracks(mains);
        }
        setLoading(false);
      });
  }, []);

  return { interviews, mainTracks, loading };
}