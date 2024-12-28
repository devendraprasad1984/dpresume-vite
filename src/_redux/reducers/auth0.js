import ENUMS from "../enums";

const init = {}
export default function Auth0(state = init, action) {
    // console.log('auth0 reducer, user payload', action.payload)
    switch (action.type) {
        case ENUMS.AUTH0:
            return {...action.payload}
        default:
            return state
    }
}