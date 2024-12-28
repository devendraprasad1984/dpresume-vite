import React from "react";

const OneLinerHeader = ({title}) => {
  // const color = { backgroundColor: getRandomColor() };
  return (
    <div className="size20 bl pad5 active-parent">
      {title}
    </div>
  );
};

export default React.memo(OneLinerHeader);
