import React from 'react'
import MainNav from './components/MainNav'
import {Provider} from "react-redux";
import {applyMiddleware, combineReducers, createStore} from "redux";
import * as reducers from "./components/redux/reducers/Reducers";
import thunk from "redux-thunk";

const rootReducer = combineReducers({
    config: reducers.configReducer
    ,agent: reducers.agentReducer
    ,cart: reducers.cartReducer
})
const store = createStore(rootReducer, applyMiddleware(thunk))
export default function App() {
    return <Provider store={store}>
        <MainNav />
        {/*<TestCamera />*/}
    </Provider>
}
