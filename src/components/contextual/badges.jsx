import React from "react";
import constEnums from "../../core/constEnums.js";

const Badges = ({
                  array = []
                }) => {
  return array.map((title, index) => {
    return <span className="badge">{title}</span>;
  });
};
export default Badges;
