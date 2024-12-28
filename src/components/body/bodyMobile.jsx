import React from "react";
import AppRoutes from "../route.jsx";
import LeftMobile from "./component/leftMobile.jsx";

const BodyMobile = () => {
  return <React.Fragment>
    <div className="wid30 main-left mwid100 overflow"><LeftMobile/></div>
    <div className="wid100 main-center mwid100 overflow"><AppRoutes/></div>
  </React.Fragment>;
};
export default BodyMobile;