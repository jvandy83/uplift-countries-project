import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import CountryList from "./components/CountryList";

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

function App() {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  return (
    <div>
      {!selectedCountry && <h1>Countries Explorer</h1>}
      <CountryList
        onCountrySelect={setSelectedCountry}
        selectedCountry={selectedCountry}
      />
    </div>
  );
}

export default App;
