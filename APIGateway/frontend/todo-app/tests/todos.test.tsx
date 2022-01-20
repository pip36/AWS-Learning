import { render, screen } from "@testing-library/react";
import { rest } from "msw";
import App from "../src/App";
import { FAILED_TODOS_MESSAGE, NO_TODOS_MESSAGE } from "../src/domain/Todo";
import db from "./mocks/db";
import { server } from "./mocks/server";

beforeEach(() => {
  db.seedTodos();
});

describe("Main Page", () => {
  test("Message is displayed when no todos exist.", async () => {
    db.clear();
    render(<App />);
    expect(await screen.findByText(NO_TODOS_MESSAGE)).toBeInTheDocument();
  });

  test("Todos should be displayed.", async () => {
    render(<App />);

    const expectedTodoText = db.getTodos().map((x) => x.description);

    expectedTodoText.forEach(async (x) => {
      expect(await screen.findByText(x)).toBeInTheDocument();
    });

    expect(screen.queryByText(NO_TODOS_MESSAGE)).not.toBeInTheDocument();
  });

  test("When todos returns 500, error message is displayed", async () => {
    server.use(
      rest.get("https://api-url/todos", (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({}));
      })
    );

    render(<App />);

    expect(await screen.findByText(FAILED_TODOS_MESSAGE)).toBeInTheDocument();
  });

  test("When todos fails to connect, error message is displayed", async () => {
    server.use(
      rest.get("https://api-url/todos", (req, res, ctx) => {
        return res.networkError("Failed to connect.");
      })
    );

    render(<App />);

    expect(await screen.findByText(FAILED_TODOS_MESSAGE)).toBeInTheDocument();
  });
});
