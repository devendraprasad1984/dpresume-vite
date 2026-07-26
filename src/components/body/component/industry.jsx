const printName = (props) => {
  return <div className="wt600 col">
    <a className="size18 text-primary underline" href={props.linkedIn} target="_blank">{props.name} 💼</a>
    <span className="size12 text-muted">{props.label}</span>
  </div>;
};
const YuliaGroza = printName({
  name: "Yulia Groza",
  label: "VP Engineering, Commerce Solutions at Blackhawk Network",
  linkedIn: "https://www.linkedin.com/in/yuliagroza/"
});
const BrianLewis = printName({
  name: "Brian Lewis",
  label: "Global Design Leader & Distinguished Engineer, at Blackhawk Network",
  linkedIn: "https://www.linkedin.com/in/briantlewis/"
});
const RenjithPillai = printName({
  name: "Renjith Chandran Pillai",
  label: "Senior Director of Engineering at Blackhawk Network",
  linkedIn: "https://www.linkedin.com/in/renjith-pillai/"
});
const SachinLala = printName({
  name: "Sachin Lala",
  label: "Managing Director @ Goldman Sach & former Distinguish Engineer @ BHN",
  linkedIn: "https://www.linkedin.com/in/sachinlala/"
});
const AmitKGupta = printName({
  name: "Amit Kumar Gupta",
  label: "Director at NATWEST Group India",
  linkedIn: "https://www.linkedin.com/in/amit-kumar-a996619/"
});
const ParagJain = printName({
  name: "Parag Jain",
  label: "CIO|CTO| Seasoned IT leader| GCC Leadership| BFSI Leader| AI Leader| Wholesale and Investment Banking",
  linkedIn: "https://www.linkedin.com/in/paragjain78/"
});
const namesArr = [
  YuliaGroza,
  BrianLewis,
  RenjithPillai,
  SachinLala,
  ParagJain,
  AmitKGupta,
];
const Industry = () => {
  return <div className={`pad10`}>
    <div className="size20 bold">Leaders I work(ed) with...</div>
    <ul className={`margin--y-10`}>
      {namesArr.map((people, index) => {
        return <li key={`people-${index}}`}>{people}</li>;
      })}
    </ul>
  </div>;
};
export default Industry;
