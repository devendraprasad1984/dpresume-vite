import oneliners from "oneliners";
import FieldSetWrapper from "./fieldSetWrapper.jsx";

const IFrameWrapper = ({
  src
}) => {
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
