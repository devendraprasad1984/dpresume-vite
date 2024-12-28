import {action, computed, configure, makeAutoObservable, observable} from "mobx";

export interface ITodoItem {
    id: number,
    text: string,
    done: boolean
}

configure({
    enforceActions: 'never'
})

class TodoStore {
    todoList: ITodoItem[] = []
    todo: ITodoItem = this.initTodo()

    constructor() {
        makeAutoObservable(this, {
            todoList: observable,
            todo: observable,
            addTodo: action,
            toggleTodo: action,
            status: computed
        })
        // 2 args: 1 - this context, all props point to observer
        //observes changes on this class context and rerenders the UI when changes happen from anywhere in app
    }

    //computed - gives about metadata from store rather changing store
    get status() {
        let completed = 0, remaining = 0
        this.todoList.forEach(todo => {
            if (todo.done)
                completed++
            else
                remaining++
        })
        return {completed, remaining}
    }

    initTodo() {
        return {
            id: this.todoList.length + 1,
            text: '',
            done: false
        }
    }

    //action
    addTodo() {
        console.log(`inside add to ${this.todo}`)
        this.todoList.push(this.todo)
        this.todo = this.initTodo()
    }

    toggleTodo(id: number) {
        console.log(`inside toggle to ${id}`)
        let index: number = this.todoList.findIndex((t: ITodoItem) => t.id === id)
        if (index !== -1) {
            this.todoList[index].done = !this.todoList[index].done
        }
    }
}

const todoStore = new TodoStore() //store should be singleton
export default todoStore