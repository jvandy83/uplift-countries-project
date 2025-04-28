import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import CountryList from "./CountryList"; // This will initially fail as the component doesn't exist

describe("CountryList", () => {
  test("should show a loading indicator initially", () => {
    render(<CountryList />);
    // Expect some text like "Loading countries..." or similar
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
