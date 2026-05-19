import React, { useMemo } from "react";
import x from "@assets/icons/x.svg";
import { useGetAllCategories, useGetAllVenues } from "@api/events";

export type Filters = {
  categories: string[];
  startDate: string;
  endDate: string;
  priceMin: number | undefined;
  priceMax: number | undefined;
  locations: string[];
};

type Props = {
  filters: Filters;
  setFilters: (updater: React.SetStateAction<Filters>) => void;
};

const parseNumber = (value: string) => {
  return value === "" ? 0 : Number(value);
};

const Filters = ({ filters, setFilters }: Props) => {
  const { data: categoriesResponse } = useGetAllCategories();
  const { data: venuesResponse } = useGetAllVenues();

  const categories = useMemo(() => {
    if (categoriesResponse?.status !== 200) return [];

    return categoriesResponse.data
      .map((c) => c.categoryName)
      .filter((name): name is string => Boolean(name))
      .sort((a, b) => a.localeCompare(b));
  }, [categoriesResponse]);

  const locations = useMemo(() => {
    if (venuesResponse?.status !== 200) return [];

    const cities = venuesResponse.data
      .map((v) => v.city)
      .filter((city): city is string => Boolean(city));

    return [...new Set(cities)].sort((a, b) => a.localeCompare(b));
  }, [venuesResponse]);

  const toggleArrayValue = (
    key: "categories" | "locations",
    value: string
  ) => {
    setFilters((prev) => {
      const exists = prev[key].includes(value);

      return {
        ...prev,
        [key]: exists
          ? prev[key].filter((v) => v !== value)
          : [...prev[key], value]
      };
    });
  };

  return (
    <div className="filters">
      <h3>Filters</h3>

      <div className="filter-section">
        <h3>Categories</h3>

        {categories.map((cat) => (
          <label key={cat} className="checkbox-row">
            <span className="checkbox-label">{cat}</span>

            <input
              type="checkbox"
              checked={filters.categories.includes(cat)}
              onChange={() => toggleArrayValue("categories", cat)}
            />

            <span className="custom-checkbox">
              {filters.categories.includes(cat) && (
                <img src={x} className="checkbox-icon" alt="" />
              )}
            </span>
          </label>
        ))}
      </div>

      <div className="filter-section">
        <h4>Dates</h4>

        <div className="date-row">
          <label>Event start after</label>
          <div className="date-input-wrapper">
            <button
              type="button"
              className={`date-clear-button ${filters.startDate ? "date-clear-button-visible" : ""}`}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  startDate: ""
                }))
              }
              aria-label="Clear start date"
              tabIndex={filters.startDate ? 0 : -1}
            >
              <img src={x} alt="" />
            </button>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  startDate: e.target.value
                }))
              }
            />
          </div>
        </div>

        <div className="date-row">
          <label>Event end before</label>
          <div className="date-input-wrapper">
            <button
              type="button"
              className={`date-clear-button ${filters.endDate ? "date-clear-button-visible" : ""}`}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  endDate: ""
                }))
              }
              aria-label="Clear end date"
              tabIndex={filters.endDate ? 0 : -1}
            >
              <img src={x} alt="" />
            </button>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  endDate: e.target.value
                }))
              }
            />
          </div>
        </div>
      </div>

      <div className="filter-section">
        <h4>Price</h4>

        <div className="price-inputs">
          <input
            type="number"
            value={filters.priceMin ?? ""}
            onChange={(e) => {
              const rawValue = e.target.value;

              setFilters((prev) => ({
                ...prev,
                priceMin: rawValue === "" ? undefined : parseNumber(rawValue)
              }));
            }}
            placeholder="0 kr"
          />

          <input
            type="number"
            value={filters.priceMax ?? ""}
            onChange={(e) => {
              const rawValue = e.target.value;

              setFilters((prev) => ({
                ...prev,
                priceMax: rawValue === "" ? undefined : parseNumber(rawValue)
              }));
            }}
            placeholder="9999 kr"
          />
        </div>
      </div>

      <div className="filter-section">
        <h4>Locations</h4>

        {locations.map((loc) => (
          <label key={loc} className="checkbox-row">
            <span className="checkbox-label">{loc}</span>

            <input
              type="checkbox"
              checked={filters.locations.includes(loc)}
              onChange={() => toggleArrayValue("locations", loc)}
            />

            <span className="custom-checkbox">
              {filters.locations.includes(loc) && (
                <img src={x} className="checkbox-icon" alt="" />
              )}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default Filters;
