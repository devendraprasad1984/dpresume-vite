import Types from "./types";

const types = Types()

const initAgentState = {
    agent: [{id: -1}]
}
export const agentReducer = (state = initAgentState, action) => {
    switch (action.type) {
        case types.keys.SET_AGENT:
            return {
                ...state,
                agent: action.data,
            }
        default:
            return state;
    }
}

