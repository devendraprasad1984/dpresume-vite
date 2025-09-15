import { computed, signal } from "@preact/signals-react";
import { useState } from "react";

const getTodos = () => {
  return [{
    completed: false,
    value: "init"
  }];
};

const todos = signal(getTodos());
const completedTodo = computed(() => todos.value.filter(t => t.completed));

const SignalTodos = () => {
  const [todoText, setTodoText] = useState("");

  const handleTodoToggle = (index) => {
    todos.value = todos.value.map((t, i) => {
      if (i === index) {
        t.completed = !t.completed;
        return t;
      }
      return t;
    });
  };
  const handleSubmit = () => {
    todos.value = [
      ...todos.value,
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
    <h2>Signals TODO app - {completedTodo.value.length} of {todos.value.length} completed</h2>
    <div className="row space-between align-center">
      <input type="text" placeholder="Enter todo" className="wid100" value={todoText} onChange={handleSetText}/>
      <button onClick={handleSubmit}>Submit</button>
    </div>
    <div className="wid100">
      {todos.value.map((t, i) => {
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

export default SignalTodos;