import React from "react";
import FieldSetWrapper from "./fieldSetWrapper.jsx";

const VideoWrapper = ({
                        src
                      }) => {
  return <FieldSetWrapper>
    <video src={src} className="base-video"/>
  </FieldSetWrapper>;
};
export default VideoWrapper;