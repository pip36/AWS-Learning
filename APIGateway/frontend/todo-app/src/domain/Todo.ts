import { randomString, randomUUID } from "../util";

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
