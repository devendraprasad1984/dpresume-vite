import React from "react";
import { getRandomColor } from "../../configs/config";

const Badges = (props) => {
  const { list, isColor } = props;

  if (!list || list.length === 0) return null;

  return (
    <div className="size10 row wrap">
      {list.map((badge, i) => {
        let color = getRandomColor();
        let styleProps = !isColor
          ? { backgroundColor: color }
          : { color: color };
        return (
          <span
            key={"badge" + i}
            className={`pad5 roundCorner`}
            style={styleProps}
          >
            {badge}
          </span>
        );
      })}
    </div>
  );
};

export default Badges;
