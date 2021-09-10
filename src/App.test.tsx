import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders `Next`", () => {
  render(<App />);
  const linkElement = screen.getByText(/Next/i);
  expect(linkElement).toBeInTheDocument();
});
