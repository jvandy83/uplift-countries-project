import { useEffect, useState } from "react";

type Country = {
  name: { common: string; official: string };
  flags: { png: string; svg: string; alt: string };
  population: number;
  region: string;
  capital: string[];
};

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

const CountryList = () => {
  const [countries, setCountries] = useState<Country[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const fetchCountries = async () => {
    try {
      setError(null);
      const response = await fetch("https://restcountries.com/v3.1/all");

      // For test mocks, response.ok might be undefined
      if (response.ok === false) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCountries(data);
    } catch (err) {
      // Handle both HTTP errors and other errors
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch countries");
      }
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  if (error) {
    return (
      <div>
        <p>Error loading countries: {error}</p>
        <button onClick={fetchCountries}>Retry</button>
      </div>
    );
  }

  if (!countries) {
    return <div>Loading countries...</div>;
  }

  const totalPages = Math.ceil(countries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleCountries = countries.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newItemsPerPage = Number(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          aria-label="Items per page"
        >
          {ITEMS_PER_PAGE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option} per page
            </option>
          ))}
        </select>
      </div>

      {visibleCountries.map((country) => (
        <div
          key={country.name.common}
          style={{ border: "1px solid #ccc", margin: 8, padding: 8 }}
        >
          <img src={country.flags.png} alt={country.flags.alt} width={32} />
          <div>
            <strong>{country.name.common}</strong>
          </div>
          <div>Region: {country.region}</div>
          <div>Population: {country.population.toLocaleString()}</div>
          <div>Capital: {country.capital?.[0] || "N/A"}</div>
        </div>
      ))}

      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CountryList;
