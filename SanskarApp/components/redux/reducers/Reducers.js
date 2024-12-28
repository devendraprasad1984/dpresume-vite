import {GET_APP_COLOR, GET_CONFIG, SET_CONFIG, GET_AGENT, SET_AGENT, GET_CART, SET_CART} from '../actions/Types';
import {Enum} from "../../common/Config";

const initConfigState = {
    config: []
    , color: '#5361cd'
    , btn: '#b753cd'
    ,txt:'white'
}

export const configReducer=(state = initConfigState, action)=> {
    switch (action.type) {
        case GET_CONFIG || GET_APP_COLOR:
            return state
        case SET_CONFIG:
            let color = action.data[Enum.configKeys.appColor]
            let btn = action.data[Enum.configKeys.btnColor]
            let txt=action.data[Enum.configKeys.btnTextColor]
            return {
                ...state,
                config: action.data,
                color: color,
                btn: btn,
                txt:txt
            }
        default:
            return state;
    }
}

const initAgentState = {
    agent: [{info: {id: 1, agentid: 'dp12', name: 'user'}}]
}
export const agentReducer=(state = initAgentState, action)=> {
    switch (action.type) {
        case GET_AGENT:
            return state
        case SET_AGENT:
            return {
                ...state,
                agent: action.data,
            }
        default:
            return state;
    }
}


const initCartObj = {
    cart: {}
}
export const cartReducer=(state = initCartObj, action)=> {
    switch (action.type) {
        case GET_CART:
            return state
        case SET_CART:
            return {
                ...state,
                cart: action.data,
            }
        default:
            return state;
    }
}
