import React from "react";
import VideoWrapper from "../../components/contextual/video.jsx";
import links from "../../core/links.js";
import IFrameWrapper from "../../components/contextual/iframe.jsx";
import Goto from "../../components/contextual/goto.jsx";

const AdminVideo = () => {
  return <React.Fragment>
    <Goto src={links.iframe.geekAdminUI}/>
    <IFrameWrapper src={links.iframe.geekAdminUI}/>
    <VideoWrapper src={links.video.geekAdmin}/>
  </React.Fragment>;
};
export default AdminVideo;