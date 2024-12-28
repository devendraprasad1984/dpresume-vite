export const SET_CONFIG = 'SET_CONFIG';
export const GET_CONFIG = 'GET_CONFIG';
export const GET_APP_COLOR='GET_APP_COLOR';
export const SET_AGENT='SET_AGENT';
export const GET_AGENT='GET_AGENT';
export const SET_CART='SET_CART';
export const GET_CART='GET_CART';


export const setConfig = (config) => {
    return {
        type: SET_CONFIG
        , data: config
    }
}
export const fetchError=()=> {
    return {
        type: "FETCH_ERROR"
    }
}
export const setAgentToStore = (data) => {
    return {
        type: SET_AGENT
        , data: data
    }
}
export const setCartToStore = (data) => {
    return {
        type: SET_CART
        , data: data
    }
}
