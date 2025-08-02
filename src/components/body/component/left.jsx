import React from "react";
import {NavLink} from "react-router-dom";
import commonHelper from "./commonHelper.jsx";

const Left = () => {
  const activeCallback = commonHelper().seeIfActive;
  return <div className="main-left-container col gap5">
    <div>
      <h2 className="bold">Personal Info</h2>
      <ul className="">
        <li className="size20">
          <NavLink className={`nav-link`}
                   style={activeCallback()}
                   to="/">Home</NavLink>
        </li>
        <li className="size20">
          <NavLink className={`nav-link`} to="/about"
                   style={activeCallback()}
          >About me</NavLink>
        </li>
      </ul>
    </div>

    <div>
      <h2 className="margin--y-10 bold">Professional Projects</h2>
      <ul className="">
        <li className="size20">
          <NavLink className={`nav-link`}
                   style={activeCallback()}
                   to="/projects">Projects</NavLink>
        </li>
      </ul>
    </div>

    <div>
      <h2 className="margin--y-10 bold">Out of interest</h2>
      <ul className="">
        <li className="size20">
          <NavLink className={`nav-link`}
                   style={activeCallback()}
                   to="/apps">Apps</NavLink>
        </li>
        <li className="size20">
          <NavLink className={`nav-link`}
                   style={activeCallback()}
                   to="/js-concepts">JS Concepts</NavLink>
        </li>
      </ul>
    </div>
  </div>;
};
export default Left;
