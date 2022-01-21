import { useState } from "react";
import "./App.css";
import {
  FAILED_TODOS_MESSAGE,
  NEW_TODO_LABEL,
  NO_TODOS_MESSAGE,
  useTodos,
} from "./domain/Todo";

function App() {
  const { query, commands } = useTodos();
  const todos = query.data;
  const [newTodo, setNewTodo] = useState("");

  return (
    <div className="App">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setNewTodo("");
          commands.newTodo({ description: newTodo });
        }}
      >
        <label htmlFor="new-todo">{NEW_TODO_LABEL}</label>
        <input
          id="new-todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
      </form>

      <header className="App-header">
        {query.isError && FAILED_TODOS_MESSAGE}
        {todos?.length === 0 && !query.isLoading && NO_TODOS_MESSAGE}
        {todos?.map((x) => (
          <div key={x.id} style={{ display: "flex" }}>
            <p>{x.description}</p>
            <label
              htmlFor={`remove-${x.id}`}
              style={{ display: "none" }}
            >{`remove-${x.description}`}</label>
            <button
              id={`remove-${x.id}`}
              onClick={() => commands.deleteTodo(x.id)}
            >
              X
            </button>
          </div>
        ))}
      </header>
    </div>
  );
}

export default App;
