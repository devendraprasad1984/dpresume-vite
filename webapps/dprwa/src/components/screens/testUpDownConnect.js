import React from 'react'
import {connect} from "react-redux";
import {Decrement, Increment} from "../../_redux/actions/testUpDown";
import {getTodoContent} from "../../_redux/api/get";

const todoUrl = 'https://jsonplaceholder.typicode.com/todos'
const TestUpDownConnect = props => {
    console.log('connect todo', props.todoContent)
    return <div>
        <button onClick={props.increment}>+</button>
        <span>{props.counterState}</span>
        <button onClick={props.decrement}>-</button>
        <button onClick={props.getTodo}>get todo</button>
    </div>
}

const mapX = state => {
    return {
        counterState: state.TestUpDown,
        todoContent: state.ToDo
    }
}
const mapD = dispatch => {
    return {
        increment: () => dispatch(Increment()),
        decrement: () => dispatch(Decrement()),
        getTodo: () => dispatch(getTodoContent(todoUrl))
    }
}
export default connect(mapX, mapD)(TestUpDownConnect)