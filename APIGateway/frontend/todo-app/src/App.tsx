import "./App.css";
import { NO_TODOS_MESSAGE, Todo } from "./domain/Todo";
import { useQuery } from "./util/useQuery";

function App() {
  const { isLoading, data } = useQuery<Todo[]>("https://api-url/todos");
  const todos = data;

  return (
    <div className="App">
      <header className="App-header">
        {todos?.length === 0 && !isLoading && NO_TODOS_MESSAGE}
        {todos?.map((x) => (
          <p key={x.id}>{x.description}</p>
        ))}
      </header>
    </div>
  );
}

export default App;
