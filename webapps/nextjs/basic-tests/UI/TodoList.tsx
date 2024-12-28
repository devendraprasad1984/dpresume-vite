import React from "react";
import todoStore, {ITodoItem} from "../mobx-store/todoStore";
import {Button, Checkbox, Flex, Heading, Input} from "@chakra-ui/react";
import {observer} from "mobx-react-lite";

interface ITodoListProps {

}

const TodoListItems: React.FC<ITodoListProps> = (props) => {
    return (
        <>
            {todoStore.todoList.map((todo: ITodoItem) => {
                return <Flex pt={2} key={todo.id}>
                    <Checkbox/>
                    {/*<Input mx={2} value={todo.text} onChange={(e) => (todo.text = e.target.value)}/>*/}
                    <Input mx={2} value={todo.text} onChange={(e) => DOMRectReadOnly}/>
                    <Button>Delete</Button>
                </Flex>;
            })}
        </>
    )
}

const TodoListObserver = observer(TodoListItems)
const TodoList = () => {
    return <>
        <Heading>Todo List</Heading>
        <TodoListObserver/>
    </>
}
export default TodoList