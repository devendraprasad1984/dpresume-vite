import React from "react";

const baseButtonStyles = {};
const MyButton = ({
  children,
  onClick,
  classes,
  ...resProps
}) => {
  return <button
    style={baseButtonStyles}
    className={`button-75 ${classes}`}
    onClick={onClick}
    {...resProps}
  >{children}</button>;
};
export default MyButton;
