import React from "react";
import AppRoutes from "../route.jsx";
import LeftMobile from "./component/leftMobile.jsx";

const BodyMobile = () => {
  return <React.Fragment>
    <div className="wid30 main-left mwid100p overflow"><LeftMobile/></div>
    <div className="wid100 main-center mwid100p overflow"><AppRoutes/></div>
  </React.Fragment>;
};
export default BodyMobile;