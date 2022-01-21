import { DefaultRequestBody, rest } from "msw";
import {
  CreateTodoBody,
  generateTodo,
  UpdateTodoBody,
} from "../../src/domain/Todo";
import db from "./db";

export const handlers = [
  rest.get("https://api-url/todos", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(db.getTodos()));
  }),

  rest.post<CreateTodoBody>("https://api-url/todos", (req, res, ctx) => {
    db.addTodo(generateTodo({ description: req.body.description }));
    return res(ctx.status(201), ctx.json(db.getTodos()));
  }),

  rest.put<UpdateTodoBody, { todoId: string }>(
    "https://api-url/todos/{:todoId}",
    (req, res, ctx) => {
      db.updateTodo(req.params.todoId, req.body);
      return res(ctx.status(200), ctx.json(db.getTodos()));
    }
  ),

  rest.delete<DefaultRequestBody, { todoId: string }>(
    "https://api-url/todos/{:todoId}",
    (req, res, ctx) => {
      db.deleteTodo(req.params.todoId);
      return res(ctx.status(200), ctx.json(db.getTodos()));
    }
  ),
];
