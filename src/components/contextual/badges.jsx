import React from "react";

const Badges = ({
  array = [],
  noHighlight = true
}) => {
  return array.map((title, index) => {
    if (noHighlight) {
      return <span key={"badges-" + index}>&nbsp;{title}&nbsp;</span>;
    } else {
      return <span className="w3-badge w3-indigo pad5 radius0" key={"badges-" + index}>&nbsp;{title}&nbsp;</span>;
    }
  });
};
export default Badges;
