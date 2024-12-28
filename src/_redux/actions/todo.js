import ENUMS from "../enums";

export const todoAction = (data) => {
    return {
        type: ENUMS.FETCH_TODO,
        payload: data
    }
}