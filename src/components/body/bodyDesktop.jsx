import React from "react";
import AppRoutes from "../route.jsx";
import Right from "./component/right.jsx";

const BodyDesktop = () => {
  return <React.Fragment>
    <div className="wid100 main-center mwid100 overflow"><AppRoutes/></div>
    <div className="wid30 main-right mwid100 overflow"><Right/></div>
  </React.Fragment>;
};
export default BodyDesktop;