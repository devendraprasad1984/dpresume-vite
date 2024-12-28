import React from "react";
import PrintList from "./printList.jsx";

const Skills = () => {
  return <div className="pad10">
    <div className="size24 bold">Skills</div>
    {PrintList(["Javascript", "React.JS", "AEM", "Python", "MySql"], "counter-color-yellow")}
  </div>;
};
export default Skills;
