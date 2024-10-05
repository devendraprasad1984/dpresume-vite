import React from "react";

const baseButtonStyles = {};
const MyButton = ({
                    children,
                    onClick,
                    resProps
                  }) => {
  return <button
    style={baseButtonStyles}
    className="baseButton"
    onClick={onClick}
    {...resProps}
  >{children}</button>;
};
export default MyButton;
