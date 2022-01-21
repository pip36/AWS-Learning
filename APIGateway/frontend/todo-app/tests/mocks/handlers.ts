import { rest } from "msw";
import { CreateTodoBody, generateTodo } from "../../src/domain/Todo";
import db from "./db";

export const handlers = [
  rest.get("https://api-url/todos", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(db.getTodos()));
  }),

  rest.post<CreateTodoBody>("https://api-url/todos", (req, res, ctx) => {
    db.addTodo(generateTodo({ description: req.body.description }));
    return res(ctx.status(200), ctx.json(db.getTodos()));
  }),
];
