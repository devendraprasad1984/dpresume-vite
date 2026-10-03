const leaders = [
  {
    name: "Yulia Groza",
    label: "VP Engineering, Commerce Solutions at Blackhawk Network",
    linkedIn: "https://www.linkedin.com/in/yuliagroza/"
  },
  {
    name: "Brian Lewis",
    label: "Global Design Leader & Distinguished Engineer, at Blackhawk Network",
    linkedIn: "https://www.linkedin.com/in/briantlewis/"
  },
  {
    name: "Renjith Chandran Pillai",
    label: "Senior Director of Engineering at Blackhawk Network",
    linkedIn: "https://www.linkedin.com/in/renjith-pillai/"
  },
  {
    name: "Sachin Lala",
    label: "Managing Director @ Goldman Sach & former Distinguish Engineer @ BHN",
    linkedIn: "https://www.linkedin.com/in/sachinlala/"
  },
  {
    name: "Parag Jain",
    label: "CIO|CTO| Seasoned IT leader| GCC Leadership| BFSI Leader| AI Leader| Wholesale and Investment Banking",
    linkedIn: "https://www.linkedin.com/in/paragjain78/"
  },
  {
    name: "Amit Kumar Gupta",
    label: "Director at NATWEST Group India",
    linkedIn: "https://www.linkedin.com/in/amit-kumar-a996619/"
  }
];

const Industry = () => {
  return <div className="dp-card hover-lift anim-shimmer">
    <div className="dp-card__title">Leaders I work(ed) with...</div>
    <ul>
      {leaders.map((person) => (
        <li key={person.linkedIn}>
          <a
            className="dp-leader col"
            href={person.linkedIn}
            target="_blank"
            rel="noreferrer"
          >
            <span className="size16 bold text-primary">{person.name}</span>
            <span className="size12 text-muted">{person.label}</span>
          </a>
        </li>
      ))}
    </ul>
  </div>;
};

export default Industry;
