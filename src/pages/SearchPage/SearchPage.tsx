import React from "react";
import { useSearchParams } from "react-router-dom";
import "./style.css";
import "@utility/ScrollToTop";
import SearchBar from "@pages/SearchPage/SearchBar";
import Filters from "@pages/SearchPage/Filters";
import type { Filters as FiltersType } from "@pages/SearchPage/Filters";
import EventList from "@pages/SearchPage/EventList";

export type SortOption = {
  value: string;
  label: string;
  sortBy: string;
  sortDirection: "asc" | "desc";
};

export const sortOptions: SortOption[] = [
  { value: "date-asc", label: "Date (soonest first)", sortBy: "startDate", sortDirection: "asc" },
  { value: "date-desc", label: "Date (latest first)", sortBy: "startDate", sortDirection: "desc" },
  { value: "price-asc", label: "Price (lowest first)", sortBy: "lowestPrice", sortDirection: "asc" },
  { value: "price-desc", label: "Price (highest first)", sortBy: "lowestPrice", sortDirection: "desc" }
];

const getNumberParam = (
  searchParams: URLSearchParams,
  key: string,
  fallback: number
) => {
  const value = searchParams.get(key);
  return value === null ? fallback : Number(value);
};

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = React.useState(false);

  const query = searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "";

  const filters: FiltersType = {
    categories: searchParams.getAll("category"),
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
    priceMin: getNumberParam(searchParams, "minPrice", 0),
    priceMax: getNumberParam(searchParams, "maxPrice", 9999),
    locations: searchParams.getAll("location")
  };

  const setQuery = (value: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);

      if (value.trim()) {
        newParams.set("q", value.trim());
      } else {
        newParams.delete("q");
      }

      newParams.delete("page");

      return newParams;
    }, { replace: true });
  };

  const setSort = (value: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);

      if (value) {
        newParams.set("sort", value);
      } else {
        newParams.delete("sort");
      }

      newParams.delete("page");

      return newParams;
    }, { replace: true });
  };

  const setFilters = (updater: React.SetStateAction<FiltersType>) => {
    const nextFilters =
      typeof updater === "function"
        ? updater(filters)
        : updater;

    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);

      newParams.delete("category");
      newParams.delete("location");

      nextFilters.categories.forEach((category) => {
        newParams.append("category", category);
      });

      nextFilters.locations.forEach((location) => {
        newParams.append("location", location);
      });

      if (nextFilters.startDate) {
        newParams.set("startDate", nextFilters.startDate);
      } else {
        newParams.delete("startDate");
      }

      if (nextFilters.endDate) {
        newParams.set("endDate", nextFilters.endDate);
      } else {
        newParams.delete("endDate");
      }

      if (nextFilters.priceMin > 0) {
        newParams.set("minPrice", String(nextFilters.priceMin));
      } else {
        newParams.delete("minPrice");
      }

      if (nextFilters.priceMax > 0 && nextFilters.priceMax !== 9999) {
        newParams.set("maxPrice", String(nextFilters.priceMax));
      } else {
        newParams.delete("maxPrice");
      }

      newParams.delete("page");

      return newParams;
    }, { replace: true });
  };

  return (
    <div className="SearchPage-search-page">
      <SearchBar query={query} setQuery={setQuery} />

      <button
        type="button"
        className="mobile-filter-button"
        onClick={() => setFiltersOpen(true)}
      >
        Filters
      </button>

      {filtersOpen && (
        <button
          type="button"
          className="filters-backdrop"
          aria-label="Close filters"
          onClick={() => setFiltersOpen(false)}
        />
      )}

      <div className="search-content">
        <aside className={`filters-panel ${filtersOpen ? "filters-panel-open" : ""}`}>
          <button
            type="button"
            className="filters-close-button"
            onClick={() => setFiltersOpen(false)}
          >
            Close
          </button>

          <Filters filters={filters} setFilters={setFilters} />
        </aside>

        <div className="events-section">
          <div className="sort-bar">
            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              className="sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">Default</option>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <EventList filters={filters} query={query} sort={sort} />
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
