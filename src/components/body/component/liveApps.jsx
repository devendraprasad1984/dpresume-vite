import PrintList from "./printList.jsx";

const apps = [
  {label: "giftcards.com", href: "https://giftcards.com/us/en"},
  {label: "giftcards.ca", href: "https://giftcards.com/ca/en"},
  {label: "giftcards.co.uk", href: "https://giftcards.com/uk/en"},
  {label: "Chase Palm", href: "https://reservebusiness.giftcards.com"}
];

const appLinks = apps.map((app) => (
  <a key={app.label} className="skill-label wt600 link-sweep" href={app.href} target="_blank" rel="noreferrer">
    {app.label}
  </a>
));

const LiveApps = () => {
  return <div className="dp-card hover-lift anim-shimmer">
    <div className="dp-card__title">Live Apps</div>
    {PrintList(appLinks, "counter-color-peach", "grid2x2")}
  </div>;
};

export default LiveApps;
