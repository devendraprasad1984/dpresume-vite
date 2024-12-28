import Types from "../types";

const types = Types()
const initFilter = {filters: {color: [], gender: [], price: []}}
export const filterReducer = (state = initFilter, action) => {
    switch (action.type) {
        case types.keys.SET_FILTER:
            return {...state, filters: action.payload}
        default:
            return state
    }
}

export const toggleLeftPanel = (state = {visible: true}, action) => {
    switch (action.type) {
        case types.keys.TOGGLE_LEFT_PANE:
            return {...state, visible: action.payload}
        default:
            return state
    }
}