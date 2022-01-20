import { render, screen } from "@testing-library/react";
import App from "../src/App";
import { NO_TODOS_MESSAGE } from "../src/domain/Todo";
import db from "./mocks/db";

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
});
