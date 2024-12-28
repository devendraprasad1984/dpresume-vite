import React from "react";
import CommentBox from "./CommentBox";
import CommentList from "./CommentList";
import AppVersion from "./version";
import {Link, Route} from "react-router-dom";
import {connect} from "react-redux";
import * as actions from '../redux/actions'

const CommentApp = (props) => {
    const {auth, changeAuth} = props
    const renderButton = () => {
        if (auth)
            return <button className='btn red' onClick={() => changeAuth(false)}>Sign Out</button>
        else
            return <button className='btn green' onClick={() => changeAuth(true)}>Sign In</button>
    }
    const renderHeader = () => {
        return <div className='size20'>
            <ul className='flex row center'>
                <li><Link to='/'>Home</Link></li>
                <li><Link to='/post'>Post</Link></li>
                <li>{renderButton()}</li>
            </ul>
        </div>
    }
    return (
        <div className='flex col'>
            {renderHeader()}
            <AppVersion/>
            <Route path={'/post'} component={CommentBox}/>
            <Route path={'/'} exact component={CommentList}/>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}
export default React.memo(connect(mapStateToProps, actions)(CommentApp))
