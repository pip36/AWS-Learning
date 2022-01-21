import { randomString, randomUUID } from "../util";
import { useCommand } from "../util/useCommand";
import { useQuery } from "../util/useQuery";

export type Todo = {
  id: string;
  description: string;
};

export type CreateTodoBody = {
  description: string;
};

export const generateTodo = (todo: Partial<Todo> = {}): Todo => ({
  id: randomUUID(),
  description: randomString(),
  ...todo,
});

export const NO_TODOS_MESSAGE = "You have nothing to do.";
export const FAILED_TODOS_MESSAGE = "Oops. Something went wrong...";
export const NEW_TODO_LABEL = "Add a todo";

export const useTodos = () => {
  const query = useQuery<Todo[]>("https://api-url/todos");
  const { mutate } = useCommand<CreateTodoBody>(
    "https://api-url/todos",
    "POST",
    {
      afterSuccess: () => {
        query.invalidate();
      },
    }
  );

  return {
    query,
    commands: {
      newTodo: mutate,
    },
  };
};
