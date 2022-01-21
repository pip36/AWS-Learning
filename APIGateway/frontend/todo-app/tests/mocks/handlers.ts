import { DefaultRequestBody, rest } from "msw";
import config from "../../src/config";
import {
  CreateTodoBody,
  generateTodo,
  UpdateTodoBody,
} from "../../src/domain/Todo";
import db from "./db";

export const handlers = [
  rest.get(config.TODO_API_URL, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(db.getTodos()));
  }),

  rest.post<CreateTodoBody>(config.TODO_API_URL, (req, res, ctx) => {
    db.addTodo(generateTodo({ description: req.body.description }));
    return res(ctx.status(201), ctx.json(db.getTodos()));
  }),

  rest.put<UpdateTodoBody, { todoId: string }>(
    `${config.TODO_API_URL}/{:todoId}`,
    (req, res, ctx) => {
      db.updateTodo(req.params.todoId, req.body);
      return res(ctx.status(200), ctx.json(db.getTodos()));
    }
  ),

  rest.delete<DefaultRequestBody, { todoId: string }>(
    `${config.TODO_API_URL}/{:todoId}`,
    (req, res, ctx) => {
      db.deleteTodo(req.params.todoId);
      return res(ctx.status(200), ctx.json(db.getTodos()));
    }
  ),
];
