import { act, render, screen } from "@testing-library/react";
import App from "./App";

test("renders `Next`", () => {
  render(<App />);
  const textElement = screen.getByText(/Next/i);
  expect(textElement).toBeInTheDocument();
});

test("renders `Go to move #1`", () => {
  render(<App />);
  const squares = document.getElementsByClassName("square");
  expect(squares.length).toEqual(9);
  act(() => {
    squares[0].dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
  const textElement = screen.getByText(/Go to move #1/i);
  expect(textElement).toBeInTheDocument();
});
