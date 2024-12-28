import React from "react";
import {NavLink, Route, Switch} from "react-router-dom";
import Home from "./screens/Home";
import About from "./screens/About";
import Signoff from "./screens/signoff";
import Uploader from "./screens/uploader";

// https://reactrouter.com/web/guides/quick-start
export const RoutesComponent = props => {
    return <div className='rows'>
        <div id='mainLeftDiv' className='cols mainLeftDiv'>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about" activeClassName='activeLink'>About</NavLink>
            <NavLink to="/upload" activeClassName='activeLink'>Upload</NavLink>
            <NavLink to="/signoff" activeClassName='activeLink'>signout</NavLink>
        </div>

        <div className='mainRightDiv'>
            <Switch>
                <Route exact path="/"><Home header='Home'/></Route>
                <Route path="/about"><About header='About Us'/></Route>
                <Route path="/upload"><Uploader header='Uploader'/></Route>
                <Route path="/signoff"><Signoff header='SignOff'/></Route>
            </Switch>
        </div>
    </div>
}
export default RoutesComponent

