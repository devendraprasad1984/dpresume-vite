import React from "react";
import Left from "./component/left.jsx";
import AppRoutes from "../route.jsx";
import Right from "./component/right.jsx";

const Body = () => {
  return <React.Fragment>
    <div className="wid30 main-left mwid100p border-right overflow"><Left/></div>
    <div className="wid100 main-center mwid100p overflow"><AppRoutes/></div>
    <div className="wid30 main-right mwid100p overflow glass"><Right/></div>
  </React.Fragment>;
};
export default Body;