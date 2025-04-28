import { http, HttpResponse } from "msw";

// Define the expected structure based on the API docs and requirements
// Use a minimal example for the test
const mockCountries = [
  {
    name: { common: "Mockistan", official: "Official Mockistan" },
    flags: { png: "mock.png", svg: "mock.svg", alt: "Flag of Mockistan" },
    population: 12345,
    region: "Mock Region",
    capital: ["Mockville"],
  },
  {
    name: { common: "Testland", official: "Republic of Testland" },
    flags: { png: "test.png", svg: "test.svg", alt: "Flag of Testland" },
    population: 67890,
    region: "Test Region",
    capital: ["Testburg"],
  },
];

// Define the API endpoint we want to mock
const restCountriesUrl = "https://restcountries.com/v3.1";

export const handlers = [
  // Mock the 'all' endpoint
  http.get(`${restCountriesUrl}/all`, () => {
    return HttpResponse.json(mockCountries);
  }),

  // Add mocks for other endpoints as needed (e.g., by name, code)
];
