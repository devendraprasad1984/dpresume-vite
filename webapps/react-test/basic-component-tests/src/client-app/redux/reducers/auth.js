import {AUTH_ERROR, AUTH_USER} from "../actions/types";

const INIT_STATE = {
    authenticated: '',
    errorMessage: ''
}

const authReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
        case AUTH_USER:
            return {...state, authenticated: action.payload}
        case AUTH_ERROR:
            return {...state, errorMessage: action.payload}
        default:
            return state
    }
}

export default authReducer