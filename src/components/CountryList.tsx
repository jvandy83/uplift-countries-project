import { useEffect, useState } from "react";

type Country = {
  name: { common: string; official: string };
  flags: { png: string; svg: string; alt: string };
  population: number;
  region: string;
  capital: string[];
};

const CountryList = () => {
  const [countries, setCountries] = useState<Country[] | null>(null);
  const [visibleCount, setVisibleCount] = useState(5); // Start with 5 countries

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((res) => res.json())
      .then((data) => setCountries(data));
  }, []);

  if (!countries) {
    return <div>Loading countries...</div>;
  }

  const visibleCountries = countries.slice(0, visibleCount);
  const hasMore = visibleCount < countries.length;

  return (
    <div>
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
      {hasMore && (
        <button onClick={() => setVisibleCount((prev) => prev + 5)}>
          Load More
        </button>
      )}
    </div>
  );
};

export default CountryList;
