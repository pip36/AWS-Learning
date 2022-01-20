import { render, screen } from "@testing-library/react";
import App from "../src/App";

test("A test", async () => {
  render(<App />);

  expect(await screen.findByText("First Todo")).toBeInTheDocument();
});
