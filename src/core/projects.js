const projects = [
  {
    id: "bhn-giftcards",
    role: "Senior Staff Frontend",
    company: "Blackhawk Network (BHN)",
    period: "Oct 2022 – present",
    title: "giftcards.com / shop.giftcards.com",
    url: "https://www.giftcards.com",
    tech: ["AEM", "React 18", "Storybook", "JavaScript"],
    summary:
      "Built on Adobe Experience Manager (AEM) as backbone for the site, this project transforms the legacy site. The legacy site is on WordPress and has scalability / multi-tenancy concerns. Using AEM, the framework itself gives multi-tenant and multi-lingual support for site management. We are using core HTML/JavaScript and React 18 for frontend development, using Storybook as a tool to test our components.",
  },
  {
    id: "fictiv-mp",
    role: "Lead UI Developer",
    company: "Fictiv Platform",
    period: "Aug 2022 – Oct 2022",
    title: "MP Level Calculations",
    url: "https://www.fictiv.com",
    tech: ["React", "Dashboards", "Analytics"],
    summary:
      "MP i.e. Manufacturing Partner — here at Fictiv, each MP gets a score for their performance. The idea is to onboard on the dashboard so partners can improvise, and results are automated.",
  },
  {
    id: "kroger-checkout",
    role: "Lead UI Developer",
    company: "Thoughtworks via Geektrust",
    period: "Jan 2022 – Aug 2022",
    title: "Kroger Customers Tech — Checkout, Flash Sales and Analytics",
    tech: ["React", "Node.js", "REST", "Analytics"],
    summary:
      "This project is about the flash sale items alongside checkout while shopping. We present flash sales to users on discounts, and they can order it. The node-based REST APIs are the same serving iOS, Android and Web (React based) platforms.",
  },
  {
    id: "fab-portal",
    role: "Lead UI Developer",
    company: "Thoughtworks via Geektrust",
    period: "Oct 2021 – Jan 2022",
    title: "FAB — First Abu Dhabi Bank, Colleague Experience Portal",
    tech: ["React", "MS Dynamics", "PowerApps"],
    summary:
      "At FAB, the PoC was to combine MS Dynamics, PowerApps and React to see how extensible the app can become.",
  },
  {
    id: "natwest-cex",
    role: "Tech Lead Developer",
    company: "Natwest / RBS group",
    period: "Mar 2021 – Sep 2021",
    title: "CeX — Colleague Experience Group Economics Team",
    tech: ["Python 3", "Django REST", "Postgres", "React", "D3"],
    summary:
      "A regression project for Risk Based Markets economic factors that produces risk weights on scenario variables. To achieve this, we hook Univar and Moody's analytics APIs, get data snapshots and run regression & analytics over it. We used internal SSO, Python 3, Django, Django REST, Postgres, React and D3 to achieve the output.",
  },
  {
    id: "smart-disability",
    role: "Tech Lead Developer",
    company: "Natwest / RBS group",
    period: "Aug 2020 – Jan 2021",
    title: "Smart Disability Initiatives",
    tech: ["React", "React Native", "Social platform"],
    summary:
      "I opted to be in the disability initiative and contributed by building a social network platform for disabled carers and NGOs, alongside work for the CII-IBDN Indian government body and a React & React Native app for the BDF (Business Disability Forum) group in the UK.",
  },
  {
    id: "arria-nlg",
    role: "Tech Lead Developer",
    company: "Natwest / RBS group",
    period: "Jul 2019 – Nov 2020",
    title: "Arria NLG Budgets and Forecasts Narratives",
    tech: ["MVC", "Python 3", "Tornado", "React", "Oracle 11g"],
    summary:
      "Natural language generation for budgets and forecast narratives. This project has MVC, Python 3 & Tornado, JavaScript, React and SQL & PL/SQL on an Oracle 11g stack.",
  },
  {
    id: "cnms",
    role: "Tech Lead Developer",
    company: "Natwest / RBS group",
    period: "Oct 2011 – Jan 2015",
    title: "CNMS — Cash Nostro Management System",
    tech: ["Enterprise web", "SQL"],
    summary:
      "Cash Nostro Management System — reconciliation and management of nostro cash positions across the bank.",
  },
  {
    id: "syntel-belk",
    role: "Software Engineer",
    company: "Syntel",
    period: "Mar 2011 – Sep 2011",
    title: "MarkDown Optimization tool",
    tech: ["Excel", "Unix", "HTML"],
    summary:
      "MarkDown optimization tool in Excel and an information publisher in Excel + Unix + HTML for the Belk Retail client in the US.",
  },
  {
    id: "9dimensions-prv",
    role: "Software Engineer",
    company: "9 Dimensions",
    period: "Sep 2009 – Mar 2011",
    title: "Performance Risk Valuation investment technique tool",
    tech: ["Excel", "SOAP APIs", "Dashboards"],
    summary:
      "Performance Risk Valuation investment technique tool in Excel, consuming SOAP APIs and bringing up user dashboards for finance variables and information presentation.",
  },
  {
    id: "freelance-pos",
    role: "Freelance Software Developer",
    company: "Independent",
    period: "Sep 2008 – Aug 2009",
    title: "Restaurant Management System (PoS)",
    tech: ["PoS", "Desktop"],
    summary:
      "Restaurant Management System point-of-sale application, built during the recession period as an independent developer.",
  },
  {
    id: "davim-library",
    role: "Software Developer",
    company: "DAVIM",
    period: "Aug 2007 – Aug 2008",
    title: "Library Management System",
    tech: ["VB 6.0", "Mentoring"],
    summary:
      "Library Management System in VB 6.0, alongside mentoring MCA students.",
  },
];

export default projects;
