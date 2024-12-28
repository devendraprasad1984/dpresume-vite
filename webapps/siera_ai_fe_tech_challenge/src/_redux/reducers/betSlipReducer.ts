import ActionTypes from "../actionTypes";
import {BetItemType, ReduxActionTypes} from "../../config/app-data-types";

const checkIfSelAlreadyPresent = (betsState: BetItemType[], selId: string) => {
    //make sure that selId is not duplicated in bet slips
    let found = false
    for (let index in betsState) {
        let bet: BetItemType = betsState[index]
        if (bet.id === selId) {
            found = true
            break
        }
    }
    return found
}
const BetSlipReducer = (state: BetItemType[] = [], action: ReduxActionTypes) => {
    switch (action.type) {
        case ActionTypes.BET_SLIP_ADD:
            let isFound=checkIfSelAlreadyPresent(state, action.payload.id)
            if(!isFound) return [...state, action.payload]
            return state
        case ActionTypes.BET_SLIP_REMOVE:
            let itemToBeRemovedId = action.payload.id || -1
            let filter = state.filter((slip: any) => slip.id !== itemToBeRemovedId)
            return [...filter]
        default:
            return state
    }
}
export default BetSlipReducer