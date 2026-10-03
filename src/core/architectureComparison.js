const architectureComparison = [
  {
    id: "monolith",
    tone: "mono",
    title: "Monolith",
    tagline: "One codebase, one build, one deploy.",
    strengths: [
      "Simplest mental model — a single repo, toolchain and build",
      "Sharing code is just an import; no runtime integration cost",
      "One bundle, so dependency versions and UI stay consistent by default",
      "Local development, debugging and end-to-end testing are straightforward",
    ],
    tradeoffs: [
      "Every team rides the same release train — one bad merge blocks everyone",
      "Build and CI times grow with the codebase",
      "Framework and major-version upgrades become all-or-nothing events",
      "Ownership boundaries blur as the application grows",
    ],
  },
  {
    id: "micro-frontends",
    tone: "mfe",
    title: "Micro Frontends",
    tagline: "Independent apps per team, composed at runtime.",
    strengths: [
      "Teams ship on their own cadence with no shared release train",
      "Failure and upgrade blast radius stays scoped to one domain",
      "Stacks can diverge, so upgrades happen incrementally",
      "Ownership mirrors team boundaries instead of fighting them",
    ],
    tradeoffs: [
      "Duplicate dependencies inflate total bytes without deliberate sharing",
      "Runtime composition, routing and shared state add real complexity",
      "Cross-app consistency needs a design system plus governance",
      "Local development, observability and E2E testing get harder",
    ],
  },
];

export default architectureComparison;
