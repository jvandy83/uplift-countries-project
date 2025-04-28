import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import CountryList from "./components/CountryList";

function App() {
  const [selectedCountry, setSelectedCountry] = useState(null);

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
