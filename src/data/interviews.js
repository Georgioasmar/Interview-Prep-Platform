export const MOCK_INTERVIEWS = {
  quant: {
    id: "quant",
    title: "Quantitative Finance",
    description:
      "Prepare for rigorous quantitative interviews. Covers stochastic calculus, probability, linear algebra, and brainteasers typical of Jane Street, Optiver, and Citadel.",
    subTypes: [],
    problemFilter: { tags: ["Quant", "Stochastic", "Finance"] },
    discussions: [
      { id: 1, title: "Jane Street Trading Interview 2024 - My Experience", author: "math_wizard", isPinned: true, replies: 34 },
      { id: 2, title: "How deep into measure theory do I need to go for Optiver?", author: "quant_aspirant", isPinned: false, replies: 12 },
    ],
  },
  finance: {
    id: "finance",
    title: "Traditional Finance",
    description:
      "Master the technicals for high finance roles. Learn to navigate the rigorous technical questions asked at top bulge bracket banks and elite boutiques.",
    subTypes: [
      { id: "ib", title: "Investment Banking" },
      { id: "ma", title: "Mergers & Acquisitions" },
    ],
    problemFilter: { tags: ["Finance", "Valuation"] },
    discussions: [
      { id: 3, title: "Goldman Sachs IB Superday Tips - London Office", author: "target_school_kid", isPinned: true, replies: 89 },
      { id: 4, title: "DCF assumptions that interviewers always test", author: "finance_bro", isPinned: false, replies: 5 },
    ],
  },
  ib: {
    id: "ib",
    title: "Investment Banking",
    description: "A deep dive into Investment Banking technicals. Focus heavily on modeling, accounting nuances, and enterprise valuation.",
    subTypes: [],
    problemFilter: { tags: ["IB", "Valuation", "Accounting"] },
    discussions: [
      { id: 5, title: "Walk me through a DCF - the perfect answer", author: "vp_anon", isPinned: true, replies: 156 },
    ],
  },
  ma: {
    id: "ma",
    title: "Mergers & Acquisitions",
    description: "Specialized M&A technicals including accretion/dilution modeling, synergies, and deal structuring.",
    subTypes: [],
    problemFilter: { tags: ["M&A", "Accretion", "Synergies"] },
    discussions: [],
  },
  prepa: {
    id: "prepa",
    title: "Classes Préparatoires (CPGE)",
    description: "The legendary French rigor. Prepare for the Oraux of Polytechnique (X), ENS, and Mines-Ponts.",
    subTypes: [],
    problemFilter: { tags: ["X-ENS", "Analysis", "Topology", "Algebra"] },
    discussions: [
      { id: 6, title: "X 2023 Maths 1 - Unfair topology question?", author: "taupin_5_2", isPinned: false, replies: 42 },
    ],
  },
  dsa: {
    id: "dsa",
    title: "Data Structures & Algorithms",
    description: "Standard Big Tech software engineering preparation with a focus on mathematical optimization.",
    subTypes: [],
    problemFilter: { tags: ["DSA", "Graphs", "Dynamic Programming"] },
    discussions: [],
  },
  consulting: {
    id: "consulting",
    title: "Management Consulting",
    description: "MBB Case interviews, rapid mental math, and market sizing drills.",
    subTypes: [],
    problemFilter: { tags: ["Consulting", "Mental Math", "Market Sizing"] },
    discussions: [
      { id: 7, title: "McKinsey PEI - Structuring your personal impact story", author: "mbb_bound", isPinned: true, replies: 28 },
    ],
  },
};

export const MAIN_TRACKS = ["quant", "finance", "prepa", "dsa", "consulting"];