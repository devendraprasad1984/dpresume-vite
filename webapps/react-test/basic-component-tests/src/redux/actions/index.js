import {CHANGE_AUTH, FETCH_COMMENTS, SAVE_COMMENT} from "./types";
import axios from "axios";
import urls from "../../urls";

export function saveComment(comment) {
    return {
        type: SAVE_COMMENT,
        payload: comment
    }
}


export function fetchComments() {
    const res = axios.get(urls.comments)
    return {
        type: FETCH_COMMENTS,
        payload: res
    }
}

export function changeAuth(flagAuth) {
    return {
        type: CHANGE_AUTH,
        payload: flagAuth
    }
}