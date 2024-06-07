import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Header from "./header";
import SearchFilter from "./searchFilter";
import CountriesList from "./countriesList";
import "./UI/countriesContainer.scss";

interface Country {
  name: string;
  region: string;
  area: number;
}

const CountriesContainer: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filter, setFilter] = useState("");
  const [filterByArea, setFilterByArea] = useState(false);
  const [filterByRegion, setFilterByRegion] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState<keyof Country>("name");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        //because the server was acting weird on the day when I was doing this assignment, i cached the data on my browser for easier accessibility. (It's not that common for countries to change their names, area or region)
        const cachedData = sessionStorage.getItem("countriesData");
        if (cachedData) {
          const data = JSON.parse(cachedData);
          setCountries(data);
          setFilteredCountries(data);
        } else {
          const response = await axios.get<Country[]>(
            "https://restcountries.com/v2/all?fields=name,region,area"
          );
          sessionStorage.setItem(
            "countriesData",
            JSON.stringify(response.data)
          );
          setCountries(response.data);
          setFilteredCountries(response.data);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const sortCountries = (field: keyof Country) => {
    setSortField(field);
    applySortAndFilter(field);
  };

  const applySortAndFilter = useCallback(
    (currentSortField: keyof Country) => {
      const sortedCountries = [...filteredCountries].sort((a, b) => {
        const valueA = a[currentSortField];
        const valueB = b[currentSortField];

        if (typeof valueA === "string" && typeof valueB === "string") {
          return valueA.localeCompare(valueB);
        } else if (typeof valueA === "number" && typeof valueB === "number") {
          return valueA - valueB;
        }
        return 0;
      });
      if (
        JSON.stringify(filteredCountries) !== JSON.stringify(sortedCountries)
      ) {
        setFilteredCountries(sortedCountries);
      }
    },
    [filteredCountries]
  );

  useEffect(() => {
    const lithuania = countries.find((country) => country.name === "Lithuania");
    const lithuaniaArea = lithuania ? lithuania.area : 65300;
    const filtered = countries.filter((country) => {
      const countryName = country.name.toLowerCase();
      const countryRegion = country.region.toLowerCase();
      const countryArea = country.area ? country.area.toString() : "";

      return (
        (countryName.includes(filter.toLowerCase()) ||
          countryRegion.includes(filter.toLowerCase()) ||
          countryArea.includes(filter)) &&
        (!filterByArea || (country.area && country.area < lithuaniaArea)) &&
        (!filterByRegion || countryRegion === "oceania")
      );
    });
    setFilteredCountries(filtered);
  }, [filter, countries, filterByArea, filterByRegion]);

  useEffect(() => {
    applySortAndFilter(sortField);
  }, [sortField, applySortAndFilter]);

  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentItems = filteredCountries.slice(firstItemIndex, lastItemIndex);
  const totalPages = Math.ceil(filteredCountries.length / itemsPerPage);

  return (
    <div className="container">
      <Header className="header" />
      <SearchFilter className="search-filter" onFilterChange={setFilter} />
      <div className="filter-controls">
        <div>
          <div className="filter-checkboxes">
            <label>
              <input
                type="checkbox"
                checked={filterByArea}
                onChange={() => setFilterByArea(!filterByArea)}
              />
              Countries smaller than Lithuania
            </label>
            <label>
              <input
                type="checkbox"
                checked={filterByRegion}
                onChange={() => setFilterByRegion(!filterByRegion)}
              />
              Countries in Oceania
            </label>
          </div>
        </div>
      </div>
      <div className="sort-dropdown">
        <div>
          <select
            onChange={(e) => sortCountries(e.target.value as keyof Country)}
            value={sortField}
          >
            <option value="name">Sort by Name</option>
            <option value="region">Sort by Region</option>
            <option value="area">Sort by Area</option>
          </select>

          <div className="items-per-page-selector">
            <label htmlFor="itemsPerPage">Items per Page:</label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : currentItems.length ? (
        <CountriesList countries={currentItems} />
      ) : (
        <p>No countries found.</p>
      )}
      <div className="pagination-controls">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <button
          disabled={currentPage === totalPages || isLoading}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CountriesContainer;
