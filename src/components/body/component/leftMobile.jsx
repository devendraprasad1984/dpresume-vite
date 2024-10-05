import React from "react";
import {NavLink} from "react-router-dom";
import colors from "../../../core/colors.js";

const activeClassStyle = {
  color: colors.light.white,
  textDecoration: "underline",
  backgroundColor: colors.dark.black
};

function seeIfActive() {
  return ({isActive}) => {
    return isActive ? activeClassStyle : {};
  };
}

const LeftMobile = () => {
  return <div className="main-left-container col gap5 border-bottom">
    <ul className="row gap1 size14">
      <li className="size20">
        <NavLink className={`nav-link`}
                 style={seeIfActive()}
                 to="/">Home</NavLink>
      </li>
      <li className="size20">
        <NavLink className={`nav-link`} to="/about"
                 style={seeIfActive()}
        >About me</NavLink>
      </li>

      <li className="size20">
        <NavLink className={`nav-link`}
                 style={seeIfActive()}
                 to="/projects">Projects</NavLink>
      </li>
      <li className="size20">
        <NavLink className={`nav-link`}
                 style={seeIfActive()}
                 to="/apps">Apps</NavLink>
      </li>
    </ul>

  </div>;
};
export default LeftMobile;
