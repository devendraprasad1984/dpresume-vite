const Badges = ({
  array = [],
  noHighlight = true
}) => {
  const className = noHighlight ? "dp-badge" : "dp-badge dp-badge--solid";
  return array.map((title, index) => (
    <span className={className} key={`badges-${index}`}>{title}</span>
  ));
};

export default Badges;
