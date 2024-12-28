import React, {useEffect} from "react";
import {connect} from "react-redux";

const RequireAuth = (ChildComponent) => {
    const ComposeHoc = props => {
        const {auth, history} = props
        const checkIfAuthenticated = () => {
            if (!auth) {
                history.push('/')
            }
        }
        useEffect(() => {
            //mounting+updating
            checkIfAuthenticated()
            return () => {
                //unmounting
            }
        }, [auth])

        return <ChildComponent {...props}/>
    }
    const mapStateToProps = state => {
        return {
            auth: state.auth || state.auth.authenticated
        }
    }
    return connect(mapStateToProps)(ComposeHoc)
}
export default RequireAuth