import config from "../config";
import { randomString, randomUUID } from "../util";
import { useQuery } from "../util/useQuery";

export type Todo = {
  id: string;
  description: string;
  isDone: boolean;
};

export type CreateTodoBody = {
  description: string;
};

export type UpdateTodoBody = Partial<Omit<Todo, "id">>;

export const generateTodo = (todo: Partial<Todo> = {}): Todo => ({
  id: randomUUID(),
  description: randomString(),
  isDone: false,
  ...todo,
});

export const NO_TODOS_MESSAGE = "You have nothing to do.";
export const FAILED_TODOS_MESSAGE = "Oops. Something went wrong...";
export const NEW_TODO_LABEL = "Add a todo";

export const useTodos = () => {
  const query = useQuery<Todo[]>(config.TODO_API_URL);

  const newTodo = (body: CreateTodoBody) =>
    fetch(config.TODO_API_URL, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
      query.invalidate();
    });

  const updateTodo = (todoId: string, body: UpdateTodoBody) =>
    fetch(`${config.TODO_API_URL}/${todoId}`, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
      query.invalidate();
    });

  const deleteTodo = (todoId: string) =>
    fetch(`${config.TODO_API_URL}/${todoId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
      query.invalidate();
    });

  return {
    query,
    commands: {
      newTodo,
      deleteTodo,
      updateTodo,
    },
  };
};
