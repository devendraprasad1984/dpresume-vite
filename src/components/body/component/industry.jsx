const printName = (props) => {
  return <div className="wt600 col">
    <span className="size18">{props.name}</span>
    <span className="size12 text-muted">{props.label}</span>
  </div>;
};
const YuliaGroza = printName({
  name: "Yulia Groza",
  label: "VP Engineering, Commerce Solutions at Blackhawk Network | Software Development, System Architecture"
});
const RenjithPillai = printName({
  name: "Renjith Chandran Pillai",
  label: "Senior Director of Engineering at Blackhawk Network"
});
const SachinLala = printName({
  name: "Sachin Lala",
  label: "Managing Director @ Goldman Sach & former Distinguish Engineer @ BHN"
});
const AmitKGupta = printName({
  name: "Amit Kumar Gupta",
  label: "Director at NATWEST Group India"
});
const ParagJain = printName({
  name: "Parag Jain",
  label: "CIO|CTO| Seasoned IT leader| GCC Leadership| BFSI Leader| AI Leader| Wholesale and Investment Banking"
});
const namesArr = [
  YuliaGroza, RenjithPillai, SachinLala, ParagJain, AmitKGupta,
];
const Industry = () => {
  return <div className={`pad10`}>
    <div className="size24 bold">I directly worked with</div>
    <ul className={`margin--y-10`}>
      {namesArr.map((people, index) => {
        return <li key={`people-${index}}`}>{people}</li>;
      })}
    </ul>
  </div>;
};
export default Industry;
