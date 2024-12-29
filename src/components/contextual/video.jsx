import React, {useLayoutEffect} from "react";
import FieldSetWrapper from "./fieldSetWrapper.jsx";
import oneliners from "oneliners";

const VideoWrapper = ({
  src
}) => {
  useLayoutEffect(() => {
    oneliners.domHelpers.attachLoader();
  }, []);

  const onLoaded = () => {
    oneliners.domHelpers.detachLoader();
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