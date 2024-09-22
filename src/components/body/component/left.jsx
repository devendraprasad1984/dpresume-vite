import React from 'react';
import {NavLink} from "react-router-dom";

function seeIfActive() {
    return ({isActive}) => {
        return isActive ? "active-link" : "";
    };
}

const Left = () => {
    return <div className="overflow">
        <ul className="counter-list">
            <li className="size20">
                <NavLink className={`nav-link ${seeIfActive()}`} to="/public">Home</NavLink>
            </li>
            <li className="size20">
                <NavLink className={`nav-link ${seeIfActive()}`} to="/about">About
                    me</NavLink>
            </li>
        </ul>
    </div>
}
export default Left;
