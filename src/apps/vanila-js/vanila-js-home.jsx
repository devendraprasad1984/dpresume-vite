import React from "react";
import links from "../../core/links.js";
import IFrameWrapper from "../../components/contextual/iframe.jsx";

const VanillaJSHome = () => {
  return <React.Fragment>
    <IFrameWrapper src={links.iframe.vanillaJsHome}/>
  </React.Fragment>;
};
export default VanillaJSHome;