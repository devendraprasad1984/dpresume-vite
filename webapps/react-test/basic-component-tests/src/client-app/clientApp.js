import React from "react";
import {BrowserRouter, Route} from "react-router-dom";
import Header from "./header";
import SignUp from "./signup";
import Welcome from "./welcome";
import {connect, Provider} from "react-redux";
import {createStore, applyMiddleware} from "redux";
import reduxThunk from 'redux-thunk'
import reducers from './redux/reducers'
import Feature from "./feature";
import Signout from "./signout";
import SignIn from "./signin";

const initStore = {
    authReducer: {authenticated: localStorage.getItem('token')}
}
const store = createStore(reducers, initStore, applyMiddleware(reduxThunk))

const ClientApp = props => {
    return <div>
        <Provider store={store}>
            <BrowserRouter>
                <Header/>
                <Route path={'/'} exact component={Welcome}/>
                <Route path={'/signin'} component={SignIn}/>
                <Route path={'/signup'} component={SignUp}/>
                <Route path={'/feature'} component={Feature}/>
                <Route path={'/signout'} component={Signout}/>
            </BrowserRouter>
        </Provider>
    </div>
}
export default ClientApp
