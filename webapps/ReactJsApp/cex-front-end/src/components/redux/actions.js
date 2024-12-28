import Types from "./types";

const types = Types()

export const getSetAgent = (data) => {
    return (dispatch) => {
        dispatch(types.setAgentToStore(data))
    }
}
