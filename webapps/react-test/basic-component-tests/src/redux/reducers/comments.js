import {FETCH_COMMENTS, SAVE_COMMENT} from "../actions/types";

export default function (state = [], action) {
    switch (action.type) {
        case SAVE_COMMENT:
            return [...state, action.payload,{}]
        case FETCH_COMMENTS:
            const commentsFromAPI = action.payload.data.map(com => com.name || '~')
            return [...state, ...commentsFromAPI]
        default:
            return state
    }
}