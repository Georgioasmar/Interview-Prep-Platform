export const MOCK_PROBLEMS = [
  {
    id: 1,
    title: "The Gaussian Integral Trick",
    difficulty: "Medium",
    category: "Calculus",
    tags: ["Integrals", "X-ENS", "Analysis"],
    description:
      "Compute the value of the integral of e^(-x^2) over the entire real line without using polar coordinates directly.",
    problemText:
      "Show that $I = \\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$ by considering the square of the integral $I^2$.",
    context:
      "This technique is fundamental in probability theory for normalizing the Gaussian distribution.",
    courseMaterial:
      "Multiple Integrals and Fubini's Theorem. Recall that for non-negative functions, we can swap the order of integration.",
    hints: [
      "Consider $I^2 = \\left(\\int e^{-x^2}\\,dx\\right)\\left(\\int e^{-y^2}\\,dy\\right)$.",
      "Combine them into a double integral over $\\mathbb{R}^2$.",
      "Transition to polar coordinates where $x^2 + y^2 = r^2$.",
    ],
    correctAnswer: "sqrt(pi)",
  },
  {
    id: 2,
    title: "Stochastic Differential Pricing",
    difficulty: "Hard",
    category: "Probability",
    tags: ["Stochastic", "Quant", "Finance"],
    description:
      "Derive the drift term for a geometric Brownian motion under a change of measure.",
    problemText:
      "Given $dS_t = \\mu S_t\\,dt + \\sigma S_t\\,dW_t$, find the risk-neutral measure $\\mathbb{Q}$ such that the discounted price process is a martingale.",
    context:
      "In Finance (El Karoui style), we often use Girsanov's theorem to eliminate the drift.",
    courseMaterial:
      "Itô's Lemma and Girsanov's Theorem. Understanding the Radon-Nikodym derivative is key here.",
    hints: [
      "Apply Itô's formula to $\\ln(S_t)$ to find the dynamics of the log-price.",
      "Define the market price of risk $\\theta = (\\mu - r) / \\sigma$ and use it to construct a new Brownian motion under $\\mathbb{Q}$.",
    ],
    correctAnswer: "r",
  },
];