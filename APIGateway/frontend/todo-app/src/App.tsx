import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState<any[]>([]);

  useEffect(() => {
    fetch("https://api-url/todos").then(async (res) => {
      if (res.ok) {
        setTodos(await res.json());
      } else {
        throw "IT WENT WRONG!!";
      }
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {todos.map((x) => (
          <p key={x.id}>{x.description}</p>
        ))}
      </header>
    </div>
  );
}

export default App;
