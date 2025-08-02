import React from "react";
import { NavLink } from "react-router-dom";
import commonHelper from "./commonHelper.jsx";

const HeaderNav = () => {
  const activeCallback = commonHelper().seeIfActive;
  return <div className="main-left-container col gap5">
    <ul className="row bg-dark text-white">
      <li className="size20">
        <NavLink className={`nav-link bold`}
                 style={activeCallback()}
                 to="/">Home</NavLink>
      </li>
      <li className="size20">
        <NavLink className={`nav-link bold`} to="/about"
                 style={activeCallback()}
        >About me</NavLink>
      </li>
      <li className="size20">
        <NavLink className={`nav-link bold`}
                 style={activeCallback()}
                 to="/projects">Projects</NavLink>
      </li>

      <li className="size20">
        <NavLink className={`nav-link bold`}
                 style={activeCallback()}
                 to="/apps">Apps</NavLink>
      </li>
      <li className="size20">
        <NavLink className={`nav-link bold`}
                 style={activeCallback()}
                 to="/js-concepts">JS Concepts</NavLink>
      </li>
    </ul>
  </div>;
};
export default HeaderNav;
