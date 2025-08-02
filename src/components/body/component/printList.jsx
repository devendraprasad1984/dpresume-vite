import React from "react";

export const PrintIt = (list = [], classes = "") => {
  return list.map((li, index) => {
    if (typeof li !== "string") {
      return <li key={"item-" + index} className={`wid100 ${classes}`}>{li}</li>;
    }
    return <li key={li} className={`wid100 ${classes}`}><span className="skill-label wt600">{li}</span></li>;
  });
};

const PrintList = (list, classes) => {
  return <ul className="margin--y-5 flix grid2x2">{
    PrintIt(list, classes)
  }</ul>;
};

export default PrintList;