import React from "react";

export const PrintIt = (list = [], classes = "") => {
  return list.map((li, index) => {
    if (typeof li !== "string") {
      return <li key={"item-" + index} className={`wid100 ${classes}`}>{li}</li>;
    }
    return <li key={li} className={`wid100 ${classes}`}><span className="skill-label wt600">{li}</span></li>;
  });
};

const PrintList = (list, classes, parentClass = "") => {
  return <ul className={`margin--y-5 flix ${parentClass}`}>{
    PrintIt(list, classes)
  }</ul>;
};

export default PrintList;