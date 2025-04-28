import {
  render,
  screen,
  waitForElementToBeRemoved,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
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

  describe("Enhanced Pagination", () => {
    const mockCountries = Array.from({ length: 25 }, (_, i) => ({
      name: { common: `Country ${i}`, official: `Official Country ${i}` },
      flags: { png: "flag.png", svg: "flag.svg", alt: `Flag of Country ${i}` },
      population: 1000000,
      region: "Test Region",
      capital: ["Capital"],
    }));

    beforeEach(() => {
      window.fetch = vi.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockCountries),
        })
      ) as any;
    });

    test("displays pagination controls and initial page", async () => {
      render(<CountryList />);

      // Wait for initial load
      await screen.findByText("Country 0");

      // Check pagination info
      expect(screen.getByText("Page 1 of 5")).toBeInTheDocument();

      // Check navigation buttons
      expect(
        screen.getByRole("button", { name: /previous/i })
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();

      // Check items per page selector
      expect(screen.getByLabelText(/items per page/i)).toBeInTheDocument();

      // Verify initial page content (first 5 items)
      expect(screen.getByText("Country 0")).toBeInTheDocument();
      expect(screen.getByText("Country 4")).toBeInTheDocument();
      expect(screen.queryByText("Country 5")).not.toBeInTheDocument();
    });

    test("navigates to next page when next button is clicked", async () => {
      render(<CountryList />);

      await screen.findByText("Country 0");

      // Click next button
      fireEvent.click(screen.getByRole("button", { name: /next/i }));

      // Verify new page content
      await waitFor(() => {
        expect(screen.getByText("Country 5")).toBeInTheDocument();
        expect(screen.getByText("Country 9")).toBeInTheDocument();
        expect(screen.queryByText("Country 4")).not.toBeInTheDocument();
      });

      // Verify page number updated
      expect(screen.getByText("Page 2 of 5")).toBeInTheDocument();
    });

    test("changes items per page when selector is used", async () => {
      render(<CountryList />);

      await screen.findByText("Country 0");

      // Change items per page to 10
      fireEvent.change(screen.getByLabelText(/items per page/i), {
        target: { value: "10" },
      });

      // Verify more items are shown
      await waitFor(() => {
        expect(screen.getByText("Country 0")).toBeInTheDocument();
        expect(screen.getByText("Country 9")).toBeInTheDocument();
        expect(screen.queryByText("Country 10")).not.toBeInTheDocument();
      });

      // Verify total pages updated
      expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
    });
  });
});
