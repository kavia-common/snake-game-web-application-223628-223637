import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders HUD and Controls", () => {
  render(<App />);
  expect(screen.getByLabelText(/Game Heads-up Display/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Game Controls/i)).toBeInTheDocument();
});
