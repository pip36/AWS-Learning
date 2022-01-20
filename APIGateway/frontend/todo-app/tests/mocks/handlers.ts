import { rest } from "msw";
import db from "./db";

export const handlers = [
  rest.get("https://api-url/todos", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(db.getTodos()));
  }),
];
