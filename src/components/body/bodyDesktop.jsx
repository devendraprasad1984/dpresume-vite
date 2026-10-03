import React from "react";
import AppRoutes from "../route.jsx";
import Right from "./component/right.jsx";

const BodyDesktop = () => {
  return <React.Fragment>
    <div className="wid100 main-center mwid100 overflow glass p-5 dark:bg-transparent dark:text-white"><AppRoutes/></div>
    <div className="wid30 main-right mwid100 overflow"><Right/></div>
  </React.Fragment>;
};
export default BodyDesktop;