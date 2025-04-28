import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { describe, test, expect } from "vitest";
import CountryList from "./CountryList"; // This will initially fail as the component doesn't exist

describe("CountryList", () => {
  test("should show a loading indicator initially", () => {
    render(<CountryList />);
    // Expect some text like "Loading countries..." or similar
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("should fetch and display a list of countries", async () => {
    render(<CountryList />);
    await waitForElementToBeRemoved(() =>
      screen.queryByText(/loading countries.../i)
    );
    expect(screen.getByText("Mockistan")).toBeInTheDocument();
    expect(screen.getByText("Testland")).toBeInTheDocument();
  });
});
