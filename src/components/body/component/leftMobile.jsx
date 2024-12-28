import React from "react";
import {NavLink} from "react-router-dom";
import colors from "../../../core/colors.js";

const activeClassStyle = {
  textDecoration: "underline",
  backgroundColor: colors.light.candy,
  color: "white !important"
};

function seeIfActive() {
  return ({isActive}) => {
    return isActive ? activeClassStyle : {};
  };
}

const LeftMobile = () => {
  return <div className="main-left-container col gap5 border-bottom">
    <ul className="row gap1 size14">
      <li className="">
        <NavLink className={`nav-link`}
                 style={seeIfActive()}
                 to="/">Home</NavLink>
      </li>
      <li className="">
        <NavLink className={`nav-link`} to="/about"
                 style={seeIfActive()}
        >About me</NavLink>
      </li>

      <li className="">
        <NavLink className={`nav-link`}
                 style={seeIfActive()}
                 to="/projects">Projects</NavLink>
      </li>
      <li className="">
        <NavLink className={`nav-link`}
                 style={seeIfActive()}
                 to="/apps">Apps</NavLink>
      </li>
    </ul>

  </div>;
};
export default LeftMobile;
