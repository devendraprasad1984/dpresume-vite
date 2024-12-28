import React from "react";
import PrintList from "./printList.jsx";

const gcDotCom = <a className="skill-label wt600"
                    href="https://giftcards.com" target="_blank">giftcards.com (gc.com)</a>;
const LiveApps = () => {
  return <div className="pad10">
    <div className="size24 bold">Live Apps</div>
    {PrintList([gcDotCom], "counter-color-light-blue")}
  </div>;
};
export default LiveApps;
