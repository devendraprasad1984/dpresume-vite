import React from 'react'
import {NavLink} from "react-router-dom";

const Nav = props => {
    const {to, name} = props
    return <span>
        <NavLink to={to}>{name}</NavLink>
    </span>
}

export default Nav;
