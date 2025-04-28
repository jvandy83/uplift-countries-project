import { render, screen } from "@testing-library/react";
import App from "./App";
import { expect, test, describe } from "vitest";

describe("App", () => {
  test("renders the main heading", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: /countries explorer/i })
    ).toBeInTheDocument();
  });

  test("renders the CountryList component (initially loading)", () => {
    render(<App />);
    // Check for the loading text from CountryList
    expect(screen.getByText(/loading countries.../i)).toBeInTheDocument();
  });
});
