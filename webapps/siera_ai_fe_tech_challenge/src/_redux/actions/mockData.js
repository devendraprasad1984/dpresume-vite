import ActionTypes from "../actionTypes";

export const MockData = (payload) => {
    return {
        type: ActionTypes.GET_MOCK,
        payload
    }
}
export const actionGetSetSelCount = (payload) => {
    return {
        type: ActionTypes.GET_SET_TEAM2WIN_COUNT,
        payload
    }
}