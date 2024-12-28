import {applyMiddleware, combineReducers, createStore} from "redux";
import thunk from "redux-thunk";
import TestUpDown from "./reducers/testUpDown";
import ToDo from "./reducers/todo";
import Auth0 from "./reducers/auth0";

const initStore = {}
const rootReducer = combineReducers({
    TestUpDown,
    ToDo,
    Auth0
})
// const sayHi = param => next => action => {
//     console.log('hi its dispatch',param)
//     next(action)
// }
const _thunk = applyMiddleware(thunk)
// const _compose = compose(_thunk,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
const store = createStore(rootReducer, initStore, _thunk)
export default store