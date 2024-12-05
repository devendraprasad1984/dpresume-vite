import React, {useLayoutEffect} from "react";
import FieldSetWrapper from "./fieldSetWrapper.jsx";
import domHelper from "../../core/domHelper.js";

const IFrameWrapper = ({
  src
}) => {
  useLayoutEffect(() => {
    domHelper.attachLoader();
  }, []);

  const onLoaded = () => {
    domHelper.detachLoader();
  }
  return <FieldSetWrapper>
    <iframe
      onLoad={onLoaded}
      src={src}
      className="iframe-base"
      width="800"
      height="600"
      frameBorder="0" scrolling="no"
    />
  </FieldSetWrapper>;
};
export default IFrameWrapper;
