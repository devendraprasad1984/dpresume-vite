import React from "react";

const PrintIt = (list = [], classes = "") => {
  return list.map((li, index) => {
    if (typeof li !== "string") {
      return <li key={"item-" + index} className={`wid100 ${classes}`}>{li}</li>;
    }
    return <li key={li} className={`wid100 ${classes}`}><span className="skill-label wt600 size20">{li}</span></li>;
  });
};

const PrintList = (list, classes) => {
  return <ul className="margin--y-10 flix">{
    PrintIt(list, classes)
  }</ul>;
};

export default PrintList;