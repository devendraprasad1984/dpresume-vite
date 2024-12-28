import React from "react";
import Left from "./component/left.jsx";
import AppRoutes from "../route.jsx";
import Right from "./component/right.jsx";

const BodyDesktop = () => {
  return <React.Fragment>
    <div className="wid30 main-left mwid100 border-right overflow"><Left/></div>
    <div className="wid100 main-center mwid100 overflow"><AppRoutes/></div>
    <div className="wid30 main-right mwid100 overflow"><Right/></div>
  </React.Fragment>;
};
export default BodyDesktop;