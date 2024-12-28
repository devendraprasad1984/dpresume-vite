import ActionTypes from "../actionTypes";

export const BetItemAdd = (payload) => {
    return {
        type: ActionTypes.BET_SLIP_ADD,
        payload
    }
}
export const BetItemRemove = (payload) => {
    return {
        type: ActionTypes.BET_SLIP_REMOVE,
        payload
    }
}
export const BetItemList = () => {
    return {
        type: ActionTypes.BET_SLIP_LIST,
    }
}
