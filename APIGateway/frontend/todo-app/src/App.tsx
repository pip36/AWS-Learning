import "./App.css";
import {
  FAILED_TODOS_MESSAGE,
  NO_TODOS_MESSAGE,
  useTodos,
} from "./domain/Todo";

function App() {
  const { isLoading, isError, data } = useTodos();
  const todos = data;

  return (
    <div className="App">
      <header className="App-header">
        {isError && FAILED_TODOS_MESSAGE}
        {todos?.length === 0 && !isLoading && NO_TODOS_MESSAGE}
        {todos?.map((x) => (
          <p key={x.id}>{x.description}</p>
        ))}
      </header>
    </div>
  );
}

export default App;
