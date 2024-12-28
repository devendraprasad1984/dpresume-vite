import {applyMiddleware, compose, createStore} from "redux";
import thunk from 'redux-thunk'
import rootReducers from './reducers/index'

//this is just a dummy function to show middleware call
const sayHi = (param: any) => (next: any) => (action: any) => {
    console.log('printing state object', store.getState())
    next(action)
}

const _thunk = applyMiddleware(thunk, sayHi)
const enhancers = compose(_thunk)
const store = createStore(rootReducers, undefined, enhancers)
export type RootState = ReturnType<typeof rootReducers>
export default store