import React from "react";

interface SearchFilterProps {
  onFilterChange: (value: string) => void;
  className?: string;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  onFilterChange,
  className,
}) => {
  return (
    <input
      className={`${className || ""}`}
      type="text"
      placeholder="Search countries..."
      onChange={(e) => onFilterChange(e.target.value)}
    />
  );
};

export default SearchFilter;
