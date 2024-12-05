import React from "react";

const Badges = ({
                  array = []
                }) => {
  return array.map((title, index) => {
    return <span className="w3-badge w3-indigo pad5 radius0" key={"badges-" + index}>{title}</span>;
  });
};
export default Badges;
