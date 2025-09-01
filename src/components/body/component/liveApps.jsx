import React from "react";
import PrintList from "./printList.jsx";

const gcDotCom = <a className="skill-label wt600" href="https://giftcards.com/us/en" target="_blank">giftcards.com</a>;
const gcDotCA = <a className="skill-label wt600" href="https://giftcards.com/ca/en" target="_blank">giftcards.ca</a>;
const gcDotUK = <a className="skill-label wt600" href="https://giftcards.com/uk/en" target="_blank">giftcards.co.uk</a>;
const chasePalm = <a className="skill-label wt600" href="https://reservebusiness.giftcards.com" target="_blank">Chase Palm</a>;
const LiveApps = () => {
  return <div className="pad10">
    <div className="size24 bold">Live Apps</div>
    {PrintList([gcDotCom, gcDotCA, gcDotUK, chasePalm], "counter-color-peach", "grid2x2")}
  </div>;
};
export default LiveApps;
