import React from "react";
import PrintList from "./printList.jsx";

const gcDotCom = <a className="skill-label wt600" href="https://giftcards.com" target="_blank">giftcards.com</a>;
const gcDotCA = <a className="skill-label wt600" href="https://giftcards.ca" target="_blank">giftcards.ca</a>;
const gcDotUK = <a className="skill-label wt600" href="https://giftcards.co.uk" target="_blank">giftcards.co.uk</a>;
const chasePalm = <a className="skill-label wt600" href="https://reservebusiness.giftcards.com" target="_blank">Chase Palm</a>;
const LiveApps = () => {
  return <div className="pad10">
    <div className="size24 bold">Live Apps</div>
    {PrintList([gcDotCom, gcDotCA, gcDotUK, chasePalm], "counter-color-peach")}
  </div>;
};
export default LiveApps;
