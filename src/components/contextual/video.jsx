import React, {useLayoutEffect} from "react";
import FieldSetWrapper from "./fieldSetWrapper.jsx";
import domHelper from "../../core/domHelper.js";

const VideoWrapper = ({
  src
}) => {
  useLayoutEffect(() => {
    domHelper.attachLoader();
  }, []);

  const onLoaded = () => {
    domHelper.detachLoader();
  }
  return <FieldSetWrapper>
    <video
      onLoad={onLoaded}
      className="base-video"
      preload="auto" controls autoPlay
    >
      <source src={src}/>
    </video>
  </FieldSetWrapper>;
};
export default VideoWrapper;