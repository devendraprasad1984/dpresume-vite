import useMobile from "../../../hooks/useMobile.js";

const gridIfMobile = "grid autofit150";
const printName = (props) => {
  return <div className="wt600 col">
    <span className="size18 counter-color-light-blue">{props.name}</span>
    <span className="size12">{props.label}</span>
  </div>;
};
const SachinLala = printName({
  name: "Sachin Lala",
  label: "Managing Director @ Goldman Sach & former Distinguish Engineer @ BHN"
});
const NijSaha = printName({
  name: "Nij Saha",
  label: "Global C-Suite Leadership | Advisor | Angel Investor | FinTech | InsurTech | Property Investor | Entrepreneur"
});
const AmitKGupta = printName({
  name: "Amit Kumar Gupta",
  label: "Director at NATWEST Group India"
});
const ParagJain = printName({
  name: "Parag Jain",
  label: "CIO|CTO| Seasoned IT leader| GCC Leadership| BFSI Leader| AI Leader| Wholesale and Investment Banking"
});
const YuliaGroza = printName({
  name: "Yulia Groza",
  label: "VP Engineering, Commerce Solutions at Blackhawk Network | Software Development, System Architecture"
});
const RenjithPillai = printName({
  name: "Renjith Chandran Pillai",
  label: "Senior Director of Engineering at Blackhawk Network"
});
const namesArr = [
  SachinLala, NijSaha, AmitKGupta, ParagJain, YuliaGroza, RenjithPillai
];
const Industry = () => {
  const isMobile = useMobile();
  const extendedClass = `${isMobile ? gridIfMobile : " "}`;
  return <div className={`pad10`}>
    <div className="size24 bold">I directly worked with</div>
    <ul className={`margin--y-10 ${extendedClass}`}>
      {namesArr.map((people, index) => {
        return <li key={`people-${index}}`}>{people}</li>;
      })}
    </ul>
  </div>;
};
export default Industry;
