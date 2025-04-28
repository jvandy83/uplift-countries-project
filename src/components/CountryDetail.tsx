import { FaHeart, FaRegHeart } from "react-icons/fa";

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

type CountryDetailProps = {
  country: Country;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBack: () => void;
};

const CountryDetail = ({
  country,
  isFavorite,
  onToggleFavorite,
  onBack,
}: CountryDetailProps) => {
  return (
    <div>
      <div style={{ marginTop: "1rem" }}>
        <img
          src={country.flags.png}
          alt={country.flags.alt}
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
          <h2 style={{ margin: 0 }}>{country.name.common}</h2>
          <button
            onClick={onToggleFavorite}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem",
            }}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            {isFavorite ? (
              <FaHeart color="red" size={20} />
            ) : (
              <FaRegHeart color="gray" size={20} />
            )}
          </button>
        </div>
        <p>Official Name: {country.name.official}</p>
        <p>Population: {country.population.toLocaleString()}</p>
        <p>Region: {country.region}</p>
        <p>Subregion: {country.subregion}</p>
        <p>Capital: {country.capital?.[0] || "N/A"}</p>
        {country.languages && (
          <p>Languages: {Object.values(country.languages).join(", ")}</p>
        )}
        {country.currencies && (
          <p>
            Currencies:{" "}
            {Object.values(country.currencies)
              .map((c) => `${c.name} (${c.symbol})`)
              .join(", ")}
          </p>
        )}
        <p>Timezones: {country.timezones.join(", ")}</p>
        {country.borders && country.borders.length > 0 && (
          <p>Borders: {country.borders.join(", ")}</p>
        )}
        <button
          onClick={onBack}
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
};

export default CountryDetail;
