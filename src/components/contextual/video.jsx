import oneliners from "oneliners";
import FieldSetWrapper from "./fieldSetWrapper.jsx";

const VideoWrapper = ({
  src
}) => {
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