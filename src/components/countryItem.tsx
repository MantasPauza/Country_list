import React from "react";

interface Country {
  name: string;
  region: string;
  area: number;
}

interface CountryItemProps {
  country: Country;
}

type Region = "Asia" | "Europe" | "Africa" | "Oceania" | "Americas" | "Polar";

const getBackgroundColor = (region: Region) => {
  const colors: { [key in Region]: string } = {
    Asia: "#fdd835",
    Europe: "#005091",
    Africa: "#eeae24",
    Oceania: "#4da0ff",
    Americas: "#186600",
    Polar: "#cfd8dc",
  };
  return colors[region] || "#fff";
};

const CountryItem: React.FC<CountryItemProps> = ({ country }) => {
  const validRegions: Region[] = [
    "Asia",
    "Europe",
    "Africa",
    "Oceania",
    "Americas",
    "Polar",
  ];
  const region: Region = validRegions.includes(country.region as Region)
    ? (country.region as Region)
    : "Asia";
  const style = { backgroundColor: getBackgroundColor(region) };
  return (
    <li style={style}>
      <strong>{country.name}</strong>
      <div>Region: {country.region}</div>
      <div>Area: {country.area} km²</div>
    </li>
  );
};

export default CountryItem;
