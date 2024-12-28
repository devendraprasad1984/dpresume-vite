import React from 'react'
import {Grid, Input, Button} from "@chakra-ui/react";
import todoStore from "../mobx-store/todoStore";
import { observer } from 'mobx-react-lite';

function AddTodo() {
    return <>
        <Grid pt={2} templateColumns="5fr 1fr" columnGap={3}>
            <Input
                placeholder={'new todo'}
                value={todoStore.todo.text}
                onChange={(e) => (todoStore.todo.text = e.target.value)}
            />
            <Button onClick={() => todoStore.addTodo()}>Add todo</Button>
        </Grid>
    </>
}

export default observer(AddTodo)
