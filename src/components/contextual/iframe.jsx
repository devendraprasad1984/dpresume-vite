import React from "react";
import FieldSetWrapper from "./fieldSetWrapper.jsx";

const IFrameWrapper = ({
                         src
                       }) => {
  return <FieldSetWrapper>
    <iframe
      src={src}
      className="iframe-base"
      width="800"
      height="600"
      frameBorder="0" scrolling="no"
    />
  </FieldSetWrapper>;
};
export default IFrameWrapper;
