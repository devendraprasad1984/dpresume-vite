import React from "react";
import PrintList from "./printList.jsx";

const gcDotCom = <a className="skill-label wt600" href="https://giftcards.com" target="_blank">giftcards.com</a>;
const gcDotCA = <a className="skill-label wt600" href="https://giftcards.ca" target="_blank">giftcards.ca</a>;
const gcDotUK = <a className="skill-label wt600" href="https://giftcards.co.uk" target="_blank">giftcards.co.uk</a>;
const LiveApps = () => {
  return <div className="">
    <div className="size24 bold">Live Apps</div>
    {PrintList([gcDotCom], "counter-color-light-blue")}
    {PrintList([gcDotCA], "counter-color-light-blue")}
    {PrintList([gcDotUK], "counter-color-light-blue")}
  </div>;
};
export default LiveApps;
