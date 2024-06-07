import React from "react";
import CountryItem from "./countryItem";
import "./UI/listStyles.scss";

interface Country {
  name: string;
  region: string;
  area: number;
}

const CountriesList: React.FC<{ countries: Country[] }> = ({ countries }) => {
  return (
    <ul>
      {countries.map((country, index) => (
        <CountryItem key={index} country={country} />
      ))}
    </ul>
  );
};

export default CountriesList;
