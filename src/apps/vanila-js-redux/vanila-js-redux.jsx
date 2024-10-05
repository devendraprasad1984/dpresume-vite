import React from "react";
import links from "../../core/links.js";
import IFrameWrapper from "../../components/contextual/iframe.jsx";

const VanillaJSRedux = () => {
  return <React.Fragment>
    <IFrameWrapper src={links.iframe.vanillaReduxCounter}/>
  </React.Fragment>;
};
export default VanillaJSRedux;