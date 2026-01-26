// eslint-disable-next-line no-unused-vars
import React from "react";
import Industry from "./industry.jsx";
import Skills from "./skills.jsx";
import LiveApps from "./liveApps.jsx";
import Community from "./community.jsx";

const Right = () => {
  return <div className="gap10 col">
    <div className="col">
      <LiveApps/>
      <Community/>
      <Skills/>
      <Industry/>
    </div>
  </div>;
};
export default Right;
