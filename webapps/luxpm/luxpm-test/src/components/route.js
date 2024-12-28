import React from 'react'
import {Switch, Route} from 'react-router-dom'
import Splash from "./splash";
import Login from "./login";
import SignUp from "./signup";
import Nav from "../common/nav";
import {config} from "../common/config";

const Routes = props => {
    return (
        <div>
            <div id='mainLeftDiv' className='row xtop'>
                <Nav to={config.route.home.key} name={config.route.home.val}/>
            </div>
            <div className='bg page-container center flexbox'>
                <Switch>
                    <Route exact path='/'><Splash/></Route>
                    <Route path={config.route.home.key}><Splash/></Route>
                    <Route path={config.route.login.key}><Login/></Route>
                    <Route path={config.route.signup.key}><SignUp/></Route>
                </Switch>
            </div>
        </div>
    )
}

export default Routes
