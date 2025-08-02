import React, { useState } from "react";
import Left from "./component/left.jsx";
import AppRoutes from "../route.jsx";
import Right from "./component/right.jsx";

const getLeftClass = ({showHide}) => {
  let classString = "main-left mwid100 border-right overflow";
  if (showHide) {
    classString += " wid20";
  }
  return classString;
};

const BodyDesktop = () => {
  const [showHide, setShowHide] = useState(false);
  const handleShowHide = () => {
    setShowHide(!showHide);
  };
  return <React.Fragment>
    <div className={getLeftClass({showHide})}>
      <Left {...{
        showHide,
        handleShowHide
      }}/></div>
    <div className="wid100 main-center mwid100 overflow"><AppRoutes/></div>
    <div className="wid30 main-right mwid100 overflow"><Right/></div>
  </React.Fragment>;
};
export default BodyDesktop;