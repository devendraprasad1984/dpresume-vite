import React from "react";
import PrintList, { PrintIt } from "./printList.jsx";
import useMobile from "../../../hooks/useMobile.js";

const gridIfMobile = "grid autofit150";
const Skills = () => {
  const isMobile = useMobile();
  const extendedClass = `${isMobile ? gridIfMobile : " "}`;
  return <div className={`pad10`}>
    <div className="size24 bold">Skills</div>
    <ul className={`margin--y-10 flix ${extendedClass}`}>
      {PrintList(["Javascript", "React.JS", "AEM", "Python", "MySql"], "counter-color-peach", "grid2x2")}
    </ul>
  </div>;
};
export default Skills;
