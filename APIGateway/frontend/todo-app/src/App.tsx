import { useEffect, useState } from "react";
import "./App.css";
import { NO_TODOS_MESSAGE } from "./domain/Todo";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [todos, setTodos] = useState<any[]>([]);

  useEffect(() => {
    let isCancelled = false;
    fetch("https://api-url/todos").then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        if (!isCancelled) {
          setTodos(data);
          setIsLoading(false);
        }
      } else {
        throw "IT WENT WRONG!!";
      }
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {todos.length === 0 && !isLoading && NO_TODOS_MESSAGE}
        {todos.map((x) => (
          <p key={x.id}>{x.description}</p>
        ))}
      </header>
    </div>
  );
}

export default App;
