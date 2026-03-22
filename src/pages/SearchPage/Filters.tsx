import React from "react";
import x from '@assets/icons/x.svg';

export type Filters = {
  categories: string[];
  startDate: string;
  endDate: string;
  priceMin: number;
  priceMax: number;
  locations: string[];
};

type Props = {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
};

const Filters = ({ filters, setFilters }: Props) => {
  const categories = [
    "Music festival",
    "Sports",
    "Comedy Show",
    "Expo",
    "Technology",
    "Arts",
    "Theater",
    "Dance",
    "Cultural Performance",
    "Film festival",
    "Art Exhibition",
    "Historical Performance"
  ];

  const locations = ["Oslo", "Bergen", "Trondheim"];

  const parseNumber = (value: string) => {
    return value === "" ? 0 : Number(value);
  };

  const toggleArrayValue = (
    key: "categories" | "locations",
    value: string
  ) => {
    setFilters(prev => {
      const exists = prev[key].includes(value);

      return {
        ...prev,
        [key]: exists
          ? prev[key].filter(v => v !== value)
          : [...prev[key], value]
      };
    });
  };

  return (
    <div className="filters">
      <h3>Filter</h3>

      {/* CATEGORY */}
      <div className="filter-section">
        <h3>Category</h3>

        {categories.map(cat => (
          <label key={cat} className="checkbox-row">
            <span className="checkbox-label">{cat}</span>

            <input
              type="checkbox"
              checked={filters.categories.includes(cat)}
              onChange={() => toggleArrayValue("categories", cat)}
            />

            <span className="custom-checkbox">  {filters.categories.includes(cat) && (
              <img src={x} className="checkbox-icon" />
            )}</span>
          </label>
        ))}
      </div>

      {/* DATE */}
      <div className="filter-section">
        <h4>Date</h4>

        <div className="date-row">
          <label>Event start after</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={e =>
              setFilters(prev => ({
                ...prev,
                startDate: e.target.value
              }))
            }
          />
        </div>

        <div className="date-row">
          <label>Event end before</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={e =>
              setFilters(prev => ({
                ...prev,
                endDate: e.target.value
              }))
            }
          />
        </div>
      </div>

      <div className="filter-section">
        <h4>Price</h4>

        <div className="price-inputs">
          <input
            type="number"
            value={filters.priceMin}
            onChange={e =>
              setFilters(prev => ({
                ...prev,
                priceMin: parseNumber(e.target.value)
              }))
            }
            placeholder="0 kr"
          />

          <input
            type="number"
            value={filters.priceMax}
            onChange={e =>
              setFilters(prev => ({
                ...prev,
                priceMax: parseNumber(e.target.value)
              }))
            }
            placeholder="9999 kr"
          />
        </div>
      </div>

      <div className="filter-section">
        <h4>Location</h4>

        {locations.map(loc => (
          <label key={loc} className="checkbox-row">
            <span className="checkbox-label">{loc}</span>

            <input
              type="checkbox"
              checked={filters.locations.includes(loc)}
              onChange={() => toggleArrayValue("locations", loc)}
            />

            <span className="custom-checkbox">  {filters.locations.includes(loc) && (
              <img src={x} className="checkbox-icon" />
            )}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default Filters;
