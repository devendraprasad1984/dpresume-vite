import ActionTypes from "../actionTypes";
import {ReduxActionTypes} from "../../config/app-data-types";

const ErrorReducer = (state: any = [], action: ReduxActionTypes) => {
    switch (action.type) {
        case ActionTypes.SET_API_ERROR:
            return [...state, action.payload]
        default:
            return state
    }
}
export default ErrorReducer