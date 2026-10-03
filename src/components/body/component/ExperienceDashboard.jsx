import homeExperiences from "../../../core/homeExperiences.js";

const PALETTE = [
  "#5838be",
  "#008577",
  "#e91e63",
  "#ff9800",
  "#3f51b5",
  "#5ac72b",
  "#673ab7",
  "#00b5ad",
];

const decode = (html) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&#8226;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const CURATED = [
  {test: /conversion by\s*(\d+)%/i, value: (m) => `${m[1]}%`, label: "Conversion lift"},
  {test: /development times? by\s*(\d+)%/i, value: (m) => `${m[1]}%`, label: "Faster dev (AI)"},
  {test: /deployment times? by\s*(?:approx\s*)?(\d+)%/i, value: (m) => `${m[1]}%`, label: "Faster deploys"},
  {test: /\$([\d.]+)\s*million/i, value: (m) => `$${m[1]}M`, label: "Yearly savings"},
  {test: /from\s*([\d.]+)\+?mins?\s*to\s*([\d.]+)min/i, value: (m) => `${m[2]}m`, label: "Build time (was 5m)"},
  {test: /reduced customer queries by\s*(\d+)%/i, value: (m) => `${m[1]}%`, label: "Fewer support queries"},
];

const buildStats = () => {
  const roles = homeExperiences.role || [];
  const texts = roles.map(decode).filter(Boolean);
  const joined = texts.join(" ");

  const curated = [];
  CURATED.forEach((rule) => {
    const match = joined.match(rule.test);
    if (match) {
      curated.push({value: rule.value(match), label: rule.label});
    }
  });

  const bulletCount = roles.filter((r) => r.includes("&#8226;")).length;
  const metricMentions = texts.filter((t) => /(\d+%|\$[\d.]+)/.test(t)).length;
  const keywords = new Set();
  ["React", "Next.js", "Micro-frontend", "Monorepo", "Payload", "AEM", "CI/CD"].forEach((k) => {
    if (new RegExp(k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(joined)) keywords.add(k);
  });

  const auto = [
    {value: bulletCount, label: "Key achievements"},
    {value: metricMentions, label: "Measurable wins"},
    {value: keywords.size, label: "Core technologies"},
  ];

  return [...curated, ...auto];
};

const ExperienceDashboard = () => {
  const stats = buildStats();

  return (
    <div className="col gap5 margin--y-20">
      <h2 className="dp-exp-dash__title" style={{color: PALETTE[0]}}>
        Experience by the Numbers
      </h2>
      <div className="dp-exp-dash">
        {stats.map((stat, index) => {
          const color = PALETTE[index % PALETTE.length];
          return (
            <div
              key={`${stat.label}-${index}`}
              className="dp-exp-dash__card reveal "
              style={{"--stat-color": color, "--stagger": Math.min(index, 6)}}
            >
              <div className="dp-exp-dash__value" style={{color}}>
                {stat.value}
              </div>
              <div className="dp-exp-dash__label" style={{color}}>
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExperienceDashboard;
