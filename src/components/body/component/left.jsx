import React from "react";
import {NavLink} from "react-router-dom";
import colors from "../../../core/colors.js";

const activeClassStyle = {
  color: colors.light.blue,
  textDecoration: "underline"
};

function seeIfActive() {
  return ({isActive}) => {
    return isActive ? activeClassStyle : {};
  };
}

const Left = () => {
  return <div className="main-left-container col gap5">
    <div>
      <h2>Personal Info</h2>
      <ul className="">
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
      </ul>
    </div>

    <div>
      <h2 className="margin--y-10">Professional Projects</h2>
      <ul className="">
        <li className="size20">
          <NavLink className={`nav-link`}
                   style={seeIfActive()}
                   to="/projects">Projects</NavLink>
        </li>
      </ul>
    </div>

    <div>
      <h2 className="margin--y-10">Out of interest</h2>
      <ul className="">
        <li className="size20">
          <NavLink className={`nav-link`}
                   style={seeIfActive()}
                   to="/apps">Apps</NavLink>
        </li>
      </ul>
    </div>

  </div>;
};
export default Left;
