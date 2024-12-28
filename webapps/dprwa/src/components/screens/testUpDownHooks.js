import React from 'react'
import {useDispatch, useSelector} from "react-redux";
import {Decrement, Increment} from "../../_redux/actions/testUpDown";
import {getTodoContent} from "../../_redux/api/get";

const todoUrl = 'https://jsonplaceholder.typicode.com/todos'
const TestUpDownHooks = props => {
    const counterState = useSelector(_ => _.TestUpDown)
    const todoContent = useSelector(_ => _.ToDo)
    const dispatch = useDispatch()

    console.log('todoContent', todoContent)
    return <div>
        <button onClick={() => dispatch(Increment())}>+</button>
        <span>{counterState}</span>
        <button onClick={() => dispatch(Decrement())}>-</button>
        <button onClick={()=>dispatch(getTodoContent(todoUrl))}>Pull ToDo</button>
    </div>
}

export default React.memo(TestUpDownHooks)