import React from 'react';
import {NavLink} from "react-router-dom";

const Left = () => {
    return <div className="">
        <ul>
            <li>
                <NavLink to={"/"}>Home</NavLink>
            </li>
            <li>
                <NavLink to={"/about"}>About me</NavLink>
            </li>
        </ul>
    </div>
}
export default Left;
