import ENUMS from "../enums";

const init = []
export default function ToDo(state = init, action) {
    switch (action.type) {
        case ENUMS.FETCH_TODO:
            // console.log('to fetch', action.payload)
            return [...action.payload]
        default:
            return state
    }
}