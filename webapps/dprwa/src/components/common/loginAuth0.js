import React, {useState, useEffect} from 'react'
import {useAuth0} from '@auth0/auth0-react'
import {useDispatch} from "react-redux";
import {auth0Action} from "../../_redux/actions/auth0";
import OneLinerHeader from "./oneLinerHeader";

const LoginWithAuth0 = () => {
    const {loginWithPopup, logout, user, getAccessTokenSilently, isAuthenticated, isLoading} = useAuth0()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    // const [token, setToken] = useState('')
    const dispatch = useDispatch()
    // const {loginWithRedirect} = useAuth0()


    const handleLogin = async () => {
        try {
            await loginWithPopup()
            setIsLoggedIn(true)
        } catch (err) {
            console.log('error login to auth0')
        }
    }

    const handleLogout = async () => {
        try {
            await logout()
            setIsLoggedIn(false)
            dispatch(auth0Action({}))
        } catch (err) {
            console.log('error logout to auth0')
        }
    }

    const LoginBtn = (!isAuthenticated && <button onClick={() => handleLogin()} className='secondary'>
        Login with Auth0 (No Save)
    </button>)
    const LogoutBtn = (isAuthenticated && <button onClick={() => handleLogout()} className='xred'>
        Logout Auth0
    </button>)


    useEffect(() => {
        if (!user) return
        let _token = getAccessTokenSilently()
        dispatch(auth0Action({user, token: _token}))
        // setToken(_token)
        setIsLoggedIn(true)
        return () => {
            setIsLoggedIn(false)
        };
    }, [user]);


    if(isLoading)
        return <OneLinerHeader title='Loading, plz wait...'/>

    return <div className='row wrap'>
        {!isLoggedIn && LoginBtn}
        {isLoggedIn && LogoutBtn}
        {/*{isLoggedIn && JSON.stringify(user)}*/}
    </div>
}

export default LoginWithAuth0