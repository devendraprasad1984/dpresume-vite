import React, { ReactElement, ReactNode } from "react";
import RCTooltip from "rc-tooltip";

type Input = {
  children: ReactElement;
  placement?: "left" | "right" | "top" | "bottom";
  overlay: ReactNode | string;
};

const Tooltip = ({
  children,
  placement = "top",
  overlay,
}: Input): ReactElement => {
  if (!overlay) return children;
  return (
    <RCTooltip placement={placement} overlay={overlay} mouseLeaveDelay={0}>
      {children}
    </RCTooltip>
  );
};

export default Tooltip;
