import { useState } from "react";
import { proxy, useSnapshot } from "valtio";

const getTodos = () => {
  return [{
    completed: false,
    value: "init"
  }];
};

//direct update on proxy object
const todosProxy = proxy({
  todos: getTodos()
});
const completedTodo = () => todosProxy.todos.filter(t => t.completed);

const ValtioTodos = () => {
  const [todoText, setTodoText] = useState("");
  const todosState = useSnapshot(todosProxy);

  const handleTodoToggle = (index) => {
    todosProxy.todos = todosProxy.todos.map((t, i) => {
      if (i === index) {
        t.completed = !t.completed;
        return t;
      }
      return t;
    });
  };
  const handleSubmit = () => {
    todosProxy.todos = [
      ...todosProxy.todos,
      {
        completed: false,
        value: todoText
      }
    ];
    setTodoText("");
  };
  const handleSetText = (e) => {
    setTodoText(e.target.value);
  };

  return <div className="col gap2 border">
    <h2>Valtio TODO app - {completedTodo?.length} of {todosState?.todos?.length} completed</h2>
    <div className="row space-between align-center">
      <input type="text" placeholder="Enter todo" className="wid100" value={todoText} onChange={handleSetText}/>
      <button onClick={handleSubmit}>Submit</button>
    </div>
    <div className="wid100 border">
      {todosState.todos.map((t, i) => {
        return <div key={`todo-${i}`} className="row align-center space-between">
          <div className="row">
            <input type="checkbox" onClick={() => handleTodoToggle(i)}/>
            <span>{t.value}</span>
          </div>
          <div>
            <span>{t.completed ? "completed" : "not completed"}</span>
          </div>
        </div>;
      })}
    </div>
  </div>;
};

export default ValtioTodos;