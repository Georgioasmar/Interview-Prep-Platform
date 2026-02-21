import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

export function MathRenderer({ children }) {
  if (!children) return null;
  const parts = children.split(/(\$[^$]+\$)/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith("$") && part.endsWith("$")) {
          return <InlineMath key={i} math={part.slice(1, -1)} />;
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

export function BlockMathRenderer({ children }) {
  const latex = children.replace(/^\$\$|\$\$$/g, "");
  return <BlockMath math={latex} />;
}