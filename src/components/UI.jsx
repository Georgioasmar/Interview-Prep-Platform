// Shared, reusable UI primitives

import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

export function MathText({ children, block = false }) {
  return block
    ? <BlockMath math={children} />
    : <InlineMath math={children} />;
}

// Difficulty badge colours
export function DifficultyBadge({ difficulty }) {
  const colorMap = {
    Easy: "text-green-500",
    Medium: "text-yellow-500",
    Hard: "text-red-500",
  };
  return (
    <span className={colorMap[difficulty] ?? "text-slate-400"}>
      {difficulty}
    </span>
  );
}
