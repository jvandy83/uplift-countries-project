import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
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

  test('shows "N/A" if a country has no capital', async () => {
    // Arrange: mock a country with no capital
    const countries = [
      {
        name: { common: "NoCapitalia", official: "NoCapitalia" },
        flags: { png: "no.png", svg: "no.svg", alt: "Flag of NoCapitalia" },
        population: 1,
        region: "Nowhere",
        capital: [],
      },
    ];
    // Mock fetch to return this country
    window.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(countries),
      })
    ) as any;

    render(<CountryList />);
    // Wait for loading to disappear
    await screen.findByText("NoCapitalia");
    expect(screen.getByText(/Capital: N\/A/i)).toBeInTheDocument();
  });

  test("shows paginated countries with load more button", async () => {
    // Mock 10 countries
    const mockCountries = Array.from({ length: 10 }, (_, i) => ({
      name: { common: `Country ${i}`, official: `Official Country ${i}` },
      flags: { png: "flag.png", svg: "flag.svg", alt: `Flag of Country ${i}` },
      population: 1000000,
      region: "Test Region",
      capital: ["Capital"],
    }));

    window.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockCountries),
      })
    ) as any;

    render(<CountryList />);

    // Wait for initial load
    await screen.findByText("Country 0");

    // Check initial pagination (e.g., first 5 countries)
    expect(screen.getByText("Country 0")).toBeInTheDocument();
    expect(screen.getByText("Country 4")).toBeInTheDocument();
    expect(screen.queryByText("Country 5")).not.toBeInTheDocument();

    // Check for Load More button
    const loadMoreButton = screen.getByRole("button", { name: /load more/i });
    expect(loadMoreButton).toBeInTheDocument();
  });
});
