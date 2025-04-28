import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart, FaStar, FaRegStar } from "react-icons/fa";

type Country = {
  name: {
    common: string;
    official: string;
    nativeName?: { [key: string]: { official: string; common: string } };
  };
  flags: { png: string; svg: string; alt: string };
  population: number;
  region: string;
  subregion: string;
  capital: string[];
  languages?: { [key: string]: string };
  currencies?: { [key: string]: { name: string; symbol: string } };
  timezones: string[];
  borders?: string[];
};

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

const FAVORITES_KEY = "favorite_countries";

const CountryList = () => {
  const [countries, setCountries] = useState<Country[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem(FAVORITES_KEY);
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  const toggleFavorite = (countryName: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(countryName)) {
      newFavorites.delete(countryName);
    } else {
      newFavorites.add(countryName);
    }
    setFavorites(newFavorites);
    localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(Array.from(newFavorites))
    );
  };

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

  const filteredCountries =
    activeTab === "favorites"
      ? countries.filter((country) => favorites.has(country.name.common))
      : countries;

  if (selectedCountry) {
    return (
      <div>
        <div style={{ marginTop: "1rem" }}>
          <img
            src={selectedCountry.flags.png}
            alt={selectedCountry.flags.alt}
            style={{
              width: "200px",
              height: "auto",
              marginBottom: "2rem",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <h2 style={{ margin: 0 }}>{selectedCountry.name.common}</h2>
            <button
              onClick={() => toggleFavorite(selectedCountry.name.common)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.5rem",
              }}
              aria-label={
                favorites.has(selectedCountry.name.common)
                  ? "Remove from favorites"
                  : "Add to favorites"
              }
            >
              {favorites.has(selectedCountry.name.common) ? (
                <FaHeart color="red" size={20} />
              ) : (
                <FaRegHeart color="gray" size={20} />
              )}
            </button>
          </div>
          <p>Official Name: {selectedCountry.name.official}</p>
          <p>Population: {selectedCountry.population.toLocaleString()}</p>
          <p>Region: {selectedCountry.region}</p>
          <p>Subregion: {selectedCountry.subregion}</p>
          <p>Capital: {selectedCountry.capital?.[0] || "N/A"}</p>
          {selectedCountry.languages && (
            <p>
              Languages: {Object.values(selectedCountry.languages).join(", ")}
            </p>
          )}
          {selectedCountry.currencies && (
            <p>
              Currencies:{" "}
              {Object.values(selectedCountry.currencies)
                .map((c) => `${c.name} (${c.symbol})`)
                .join(", ")}
            </p>
          )}
          <p>Timezones: {selectedCountry.timezones.join(", ")}</p>
          {selectedCountry.borders && selectedCountry.borders.length > 0 && (
            <p>Borders: {selectedCountry.borders.join(", ")}</p>
          )}
          <button
            onClick={() => setSelectedCountry(null)}
            style={{
              marginTop: "2rem",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            Back to List
          </button>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(filteredCountries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleCountries = filteredCountries.slice(startIndex, endIndex);

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
        <div
          role="tablist"
          style={{
            marginBottom: "1rem",
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <button
            role="tab"
            aria-selected={activeTab === "all"}
            onClick={() => setActiveTab("all")}
            aria-controls="all-countries-tabpanel"
            id="all-countries-tab"
          >
            All Countries
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "favorites"}
            onClick={() => setActiveTab("favorites")}
            aria-controls="favorites-tabpanel"
            id="favorites-tab"
          >
            Favorites
          </button>
        </div>

        <div
          role="tabpanel"
          id="all-countries-tabpanel"
          aria-labelledby="all-countries-tab"
          hidden={activeTab !== "all"}
        >
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

          {visibleCountries.map((country) => (
            <div
              key={country.name.common}
              style={{
                border: "1px solid #ccc",
                margin: 8,
                padding: 16,
                cursor: "pointer",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              <img
                src={country.flags.png}
                alt={country.flags.alt}
                style={{
                  width: "32px",
                  height: "auto",
                  position: "absolute",
                  top: 16,
                  left: 16,
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  marginTop: "40px",
                  marginBottom: "40px",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedCountry(country)}
              >
                <div>
                  <strong>{country.name.common}</strong>
                </div>
                <div>Region: {country.region}</div>
                <div>Population: {country.population.toLocaleString()}</div>
                <div>Capital: {country.capital?.[0] || "N/A"}</div>
              </div>
              <button
                onClick={() => toggleFavorite(country.name.common)}
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.5rem",
                }}
                aria-label={
                  favorites.has(country.name.common)
                    ? "Remove from favorites"
                    : "Add to favorites"
                }
              >
                {favorites.has(country.name.common) ? (
                  <FaHeart color="red" size={20} />
                ) : (
                  <FaRegHeart color="gray" size={20} />
                )}
              </button>
            </div>
          ))}

          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              justifyContent: "center",
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

        <div
          role="tabpanel"
          id="favorites-tabpanel"
          aria-labelledby="favorites-tab"
          hidden={activeTab !== "favorites"}
        >
          {activeTab === "favorites" && filteredCountries.length === 0 && (
            <div>No favorite countries yet</div>
          )}

          {activeTab === "favorites" && filteredCountries.length > 0 && (
            <div>
              {filteredCountries.map((country) => (
                <div
                  key={country.name.common}
                  style={{
                    border: "1px solid #ccc",
                    margin: 8,
                    padding: 16,
                    cursor: "pointer",
                    borderRadius: "8px",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                  }}
                >
                  <img
                    src={country.flags.png}
                    alt={country.flags.alt}
                    style={{
                      width: "32px",
                      height: "auto",
                      position: "absolute",
                      top: 16,
                      left: 16,
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      marginTop: "40px",
                      marginBottom: "40px",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedCountry(country)}
                  >
                    <div>
                      <strong>{country.name.common}</strong>
                    </div>
                    <div>Region: {country.region}</div>
                    <div>Population: {country.population.toLocaleString()}</div>
                    <div>Capital: {country.capital?.[0] || "N/A"}</div>
                  </div>
                  <button
                    onClick={() => toggleFavorite(country.name.common)}
                    style={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "0.5rem",
                    }}
                    aria-label={
                      favorites.has(country.name.common)
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    {favorites.has(country.name.common) ? (
                      <FaHeart color="red" size={20} />
                    ) : (
                      <FaRegHeart color="gray" size={20} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountryList;
