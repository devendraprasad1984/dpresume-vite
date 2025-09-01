import React from "react";
import PrintList from "./printList.jsx";

const oneliners = <div className="col">
  <span className="skill-label wt500 size80">Oneliners</span>
  <span className="size12">core javascript utility helper methods</span>
  <span className="size12 bold">npm i oneliners <a className="size12">read me</a></span>
</div>;

const Community = () => {
  return <div className="pad10">
    <div className="size24 bold">Community</div>
      {PrintList([oneliners], "counter-color-peach", "grid2x2")}
  </div>;
};
export default Community;
