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

  describe("Error Handling", () => {
    test("displays error message when fetch fails", async () => {
      // Mock a failed fetch
      window.fetch = vi.fn(() => Promise.reject(new Error("Failed to fetch")));

      render(<CountryList />);

      // Wait for error message to appear
      await screen.findByText(/error loading countries/i);

      // Verify error message is shown
      expect(screen.getByText(/error loading countries/i)).toBeInTheDocument();

      // Verify retry button is present
      const retryButton = screen.getByRole("button", { name: /retry/i });
      expect(retryButton).toBeInTheDocument();
    });

    test("retries fetch when retry button is clicked", async () => {
      // First mock a failed fetch
      window.fetch = vi.fn(() => Promise.reject(new Error("Failed to fetch")));

      render(<CountryList />);

      // Wait for error state
      await screen.findByText(/error loading countries/i);

      // Mock a successful fetch for the retry
      const mockCountries = [
        {
          name: { common: "RetryLand", official: "RetryLand" },
          flags: { png: "flag.png", svg: "flag.svg", alt: "Flag of RetryLand" },
          population: 1000000,
          region: "Test Region",
          capital: ["Capital"],
        },
      ];

      window.fetch = vi.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockCountries),
        })
      ) as any;

      // Click retry button
      fireEvent.click(screen.getByRole("button", { name: /retry/i }));

      // Verify loading state appears
      expect(screen.getByText(/loading countries.../i)).toBeInTheDocument();

      // Verify successful load
      await screen.findByText("RetryLand");
      expect(
        screen.queryByText(/error loading countries/i)
      ).not.toBeInTheDocument();
    });
  });

  describe("Country Details", () => {
    const mockCountry = {
      name: {
        common: "Testland",
        official: "Republic of Testland",
        nativeName: {
          eng: { official: "Republic of Testland", common: "Testland" },
        },
      },
      flags: { png: "flag.png", svg: "flag.svg", alt: "Flag of Testland" },
      population: 1000000,
      region: "Test Region",
      subregion: "Test Subregion",
      capital: ["Test Capital"],
      languages: { eng: "English" },
      currencies: { USD: { name: "US Dollar", symbol: "$" } },
      timezones: ["UTC+0"],
      borders: ["BORDER1", "BORDER2"],
    };

    beforeEach(() => {
      window.fetch = vi.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve([mockCountry]),
        })
      ) as any;
    });

    test("shows country details when a country is clicked", async () => {
      render(<CountryList />);

      // Wait for country to load
      await screen.findByText("Testland");

      // Click on the country
      fireEvent.click(screen.getByText("Testland"));

      // Verify details are shown
      expect(
        screen.getByText("Official Name: Republic of Testland")
      ).toBeInTheDocument();
      expect(screen.getByText("Population: 1,000,000")).toBeInTheDocument();
      expect(screen.getByText("Region: Test Region")).toBeInTheDocument();
      expect(screen.getByText("Subregion: Test Subregion")).toBeInTheDocument();
      expect(screen.getByText("Capital: Test Capital")).toBeInTheDocument();
      expect(screen.getByText("Languages: English")).toBeInTheDocument();
      expect(screen.getByText("Currencies: US Dollar ($)")).toBeInTheDocument();
      expect(screen.getByText("Timezones: UTC+0")).toBeInTheDocument();
    });

    test("shows back button in details view", async () => {
      render(<CountryList />);

      await screen.findByText("Testland");
      fireEvent.click(screen.getByText("Testland"));

      expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
    });

    test("returns to list view when back button is clicked", async () => {
      render(<CountryList />);

      await screen.findByText("Testland");
      fireEvent.click(screen.getByText("Testland"));

      // Click back button
      fireEvent.click(screen.getByRole("button", { name: /back/i }));

      // Verify we're back to list view
      expect(screen.getByText("Testland")).toBeInTheDocument();
      expect(screen.queryByText("Official Name:")).not.toBeInTheDocument();
    });
  });
});
