import { rest } from "msw";

export const handlers = [
  rest.get("https://api-url/todos", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: "1",
          description: "First Todo",
        },
        {
          id: "2",
          description: "Second Todo",
        },
      ])
    );
  }),
];
