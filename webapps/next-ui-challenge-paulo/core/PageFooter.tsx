import React, { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

const PageFooter = () => {
  return (
    <div className={["footer", "marginUD"].join(" ")}>
      <div className={["commonStyles", "colGrid"].join(" ")}>
        <span>Footer</span>
        <div className={["rowGrid"].join(" ")}>
          <span>Links</span>
          <span>Links</span>
          <span>Links</span>
          <span>Links</span>
          <span>Links</span>
        </div>
      </div>
    </div>
  );
};

export default PageFooter;
