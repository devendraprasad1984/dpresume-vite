import React from 'react';
import {NavLink} from "react-router-dom";

function seeIfActive() {
  return ({isActive}) => {
    return isActive ? "active-link" : "";
  };
}
const checkActive = (match, location) => {
  //some additional logic to verify you are in the home URI
  if(!location) return false;
  const {pathname} = location;
  console.log(pathname);
  return pathname === "/";
}

const Left = () => {
  return <div className="main-left-container col gap5">
    <div>
      <h2>Personal Info</h2>
      <ul className="">
        <li className="size20">
          <NavLink className={`nav-link`} activeClassName="active-link" isActive={checkActive}
                   to="/">Home</NavLink>
        </li>
        <li className="size20">
          <NavLink className={`nav-link ${seeIfActive()}`} to="/about">About
            me</NavLink>
        </li>
      </ul>
    </div>

    <div>
      <h2 className="margin--y-10">Professional Projects</h2>
      <ul className="">
        <li className="size20">
          <NavLink className={`nav-link`}  activeClassName="active-link" isActive={checkActive}
                   to="/projects">Projects</NavLink>
        </li>
      </ul>
    </div>

    <div>
      <h2 className="margin--y-10">Out of interest</h2>
      <ul className="">
        <li className="size20">
          <NavLink className={`nav-link`}  activeClassName="active-link" isActive={checkActive}
                   to="/apps">Apps</NavLink>
        </li>
      </ul>
    </div>
    
  </div>
}
export default Left;
