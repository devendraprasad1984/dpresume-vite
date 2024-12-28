import ActionTypes from "../actionTypes";
import {ReduxActionTypes, ResponseType} from "../../config/app-data-types";
import {GETSETTeamToWinCount, ModifyMockData} from "./utils/updateMockData";

const MockDataReducer = (state: ResponseType[] = [], action: ReduxActionTypes) => {
    const {type, payload} = action
    switch (type) {
        case ActionTypes.GET_MOCK:
            const modifyData = ModifyMockData(payload)
            return [...modifyData]
        case ActionTypes.GET_SET_TEAM2WIN_COUNT:
            const updatedData = GETSETTeamToWinCount(state, payload)
            return [...updatedData]
        default:
            return state
    }
}
export default MockDataReducer