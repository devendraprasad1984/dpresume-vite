import React from "react";
import {PrintIt} from "./printList.jsx";
import useMobile from "../../../hooks/useMobile.js";

const gridIfMobile = "grid autofit150";
const Skills = () => {
  const isMobile = useMobile();
  const extendedClass = `${isMobile ? gridIfMobile : " "}`;
  return <div className={`pad10`}>
    <div className="size24 bold">Skills</div>
    <ul className={`margin--y-10 flix ${extendedClass}`}>
      {PrintIt(["Javascript", "React.JS", "AEM", "Python", "MySql"], "counter-color-peach permanentMarkerFamilyBefore")}
    </ul>
  </div>
    ;
};
export default Skills;
