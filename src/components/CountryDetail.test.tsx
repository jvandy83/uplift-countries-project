import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import CountryDetail from "./CountryDetail";

describe("CountryDetail", () => {
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

  test("renders country details with correct information", () => {
    render(
      <CountryDetail
        country={mockCountry}
        isFavorite={false}
        onToggleFavorite={() => {}}
        onBack={() => {}}
      />
    );

    // Check flag
    const flag = screen.getByAltText("Flag of Testland");
    expect(flag).toBeInTheDocument();
    expect(flag).toHaveAttribute("src", "flag.png");

    // Check country name
    expect(screen.getByText("Testland")).toBeInTheDocument();
    expect(
      screen.getByText("Official Name: Republic of Testland")
    ).toBeInTheDocument();

    // Check other details
    expect(screen.getByText("Population: 1,000,000")).toBeInTheDocument();
    expect(screen.getByText("Region: Test Region")).toBeInTheDocument();
    expect(screen.getByText("Subregion: Test Subregion")).toBeInTheDocument();
    expect(screen.getByText("Capital: Test Capital")).toBeInTheDocument();
    expect(screen.getByText("Languages: English")).toBeInTheDocument();
    expect(screen.getByText("Currencies: US Dollar ($)")).toBeInTheDocument();
    expect(screen.getByText("Timezones: UTC+0")).toBeInTheDocument();
    expect(screen.getByText("Borders: BORDER1, BORDER2")).toBeInTheDocument();
  });

  test("renders favorite button with correct state", () => {
    render(
      <CountryDetail
        country={mockCountry}
        isFavorite={true}
        onToggleFavorite={() => {}}
        onBack={() => {}}
      />
    );

    const favoriteButton = screen.getByRole("button", { name: /favorite/i });
    expect(favoriteButton).toBeInTheDocument();
  });

  test("renders back button", () => {
    render(
      <CountryDetail
        country={mockCountry}
        isFavorite={false}
        onToggleFavorite={() => {}}
        onBack={() => {}}
      />
    );

    const backButton = screen.getByRole("button", { name: /back to list/i });
    expect(backButton).toBeInTheDocument();
  });
});
