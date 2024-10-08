import React from "react";
import FieldSetWrapper from "./fieldSetWrapper.jsx";

const VideoWrapper = ({
                        src
                      }) => {
  return <FieldSetWrapper>
    <video
      className="base-video"
      preload="auto" controls autoPlay
    >
      <source src={src}/>
    </video>
  </FieldSetWrapper>;
};
export default VideoWrapper;