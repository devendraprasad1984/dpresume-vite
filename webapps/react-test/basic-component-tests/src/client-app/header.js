import React from "react";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import './headerStyle.css'


const Header = props => {
    const {auth} = props

    const renderLinks = () => {
        if (auth) {
            return <div>
                <Link to={'/signout'}>Sign Out</Link>
                <Link to={'/feature'}>Feature</Link>
            </div>
        } else {
            return <div>
                <Link to={'/signin'}>Sign In</Link>
                <Link to={'/signup'}>Sign Up</Link>
            </div>
        }
    }

    return <div className='headerstyle'>
        <Link to={'/'}>Redux Auth</Link>
        {renderLinks()}
    </div>
}

const mapx = state => {
    return {
        auth:  state.auth.authenticated
    }
}

export default connect(mapx)(Header)