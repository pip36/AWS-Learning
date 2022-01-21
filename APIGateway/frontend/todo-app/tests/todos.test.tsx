import {
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import App from "../src/App";
import {
  FAILED_TODOS_MESSAGE,
  NEW_TODO_LABEL,
  NO_TODOS_MESSAGE,
} from "../src/domain/Todo";
import db from "./mocks/db";
import userEvent from "@testing-library/user-event";
import { render, stubApi500Error, stubApiNetworkError } from "./utils/render";

beforeEach(() => {
  db.seedTodos();
});

describe("Todo List Feature", () => {
  test("Message is displayed when no todos exist.", async () => {
    db.clear();
    render(<App />);

    expect(await screen.findByText(NO_TODOS_MESSAGE)).toBeInTheDocument();
  });

  test("Todos should be displayed.", async () => {
    render(<App />);

    db.getTodos().forEach(async ({ description }) => {
      expect(await screen.findByText(description)).toBeInTheDocument();
    });

    expect(screen.queryByText(NO_TODOS_MESSAGE)).not.toBeInTheDocument();
  });

  test("When todos returns 500, error message is displayed", async () => {
    stubApi500Error("https://api-url/todos");

    render(<App />);

    expect(await screen.findByText(FAILED_TODOS_MESSAGE)).toBeInTheDocument();
  });

  test("When todos fails to connect, error message is displayed", async () => {
    stubApiNetworkError("https://api-url/todos");

    render(<App />);

    expect(await screen.findByText(FAILED_TODOS_MESSAGE)).toBeInTheDocument();
  });

  test("When I create a todo it becomes visible, and is persisted.", async () => {
    const { refreshPage } = render(<App />);

    const input = await screen.findByLabelText(NEW_TODO_LABEL);
    userEvent.type(input, "Another TODO{enter}");
    expect(screen.queryByDisplayValue("Another TODO")).not.toBeInTheDocument();

    refreshPage();
    expect(await screen.findByText("Another TODO")).toBeInTheDocument();
  });

  test("When I delete a todo it is removed, and is persisted.", async () => {
    const { refreshPage } = render(<App />);

    const todoToRemove = db.getTodos()[0];

    userEvent.click(
      await screen.findByLabelText(`remove-${todoToRemove.description}`)
    );

    await waitForElementToBeRemoved(() =>
      screen.queryByText(todoToRemove.description)
    );

    refreshPage();
    await screen.findByText(db.getTodos()[0].description);
    expect(
      screen.queryByText(todoToRemove.description)
    ).not.toBeInTheDocument();
  });

  test("When I toggle a todo isDone or not, it is persisted", async () => {
    const { refreshPage } = render(<App />);

    const todo = db.getTodos()[0];

    userEvent.click(await screen.findByLabelText(todo.description));

    refreshPage();
    await waitFor(() => {
      expect(screen.getByLabelText(todo.description)).toBeChecked();
    });

    userEvent.click(await screen.findByLabelText(todo.description));

    refreshPage();
    await waitFor(() => {
      expect(screen.getByLabelText(todo.description)).not.toBeChecked();
    });
  });
});
