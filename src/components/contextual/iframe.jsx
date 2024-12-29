import React, {useLayoutEffect} from "react";
import FieldSetWrapper from "./fieldSetWrapper.jsx";
import oneliners from "oneliners";

const IFrameWrapper = ({
  src
}) => {
  useLayoutEffect(() => {
    oneliners.domHelpers.attachLoader();
  }, []);

  const onLoaded = () => {
    oneliners.domHelpers.detachLoader();
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
