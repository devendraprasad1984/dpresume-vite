import React from "react";
import VideoWrapper from "../../components/contextual/video.jsx";
import links from "../../core/links.js";

const AdminVideo = () => {
  return <VideoWrapper src={links.video.geekAdmin}/>;
};
export default AdminVideo;