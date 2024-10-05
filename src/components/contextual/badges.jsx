import React from "react";

const Badges = ({
                  array = []
                }) => {
  return array.map((title, index) => {
    return <span className="badge" key={"badges-" + index}>{title}</span>;
  });
};
export default Badges;
