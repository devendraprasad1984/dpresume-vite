import ActionTypes from "../actionTypes";

const AppError = (payload) => {
    return {
        type: ActionTypes.SET_API_ERROR,
        payload
    }
}
export default AppError