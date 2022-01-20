import { randomString, randomUUID } from "../util";
import { useQuery } from "../util/useQuery";

export type Todo = {
  id: string;
  description: string;
};

export const generateTodo = (todo: Partial<Todo> = {}): Todo => ({
  id: randomUUID(),
  description: randomString(),
  ...todo,
});

export const NO_TODOS_MESSAGE = "You have nothing to do.";
export const FAILED_TODOS_MESSAGE = "Oops. Something went wrong...";

export const useTodos = () => useQuery<Todo[]>("https://api-url/todos");
