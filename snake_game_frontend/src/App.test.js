import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders HUD, Board, Controls, and theme toggle", () => {
  render(<App />);
  expect(screen.getByLabelText(/Game Heads-up Display/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Game Controls/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Snake game board/i)).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /Switch to (dark|light) mode/i })
  ).toBeInTheDocument();
});
