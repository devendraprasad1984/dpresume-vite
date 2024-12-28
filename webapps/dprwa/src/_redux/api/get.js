import {todoAction} from "../actions/todo";

export const getTodoContent = (url) => {
    return (dispatch)=>fetch(url)
        .then(res => res.json())
        .then(data => dispatch(todoAction(data)))
        .catch(e => console.log(e))
}

