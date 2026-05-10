import React from "react";
import { useSearchParams } from "react-router-dom";
import "./style.css";
import "@utility/ScrollToTop";
import SearchBar from "@pages/SearchPage/SearchBar";
import Filters from "@pages/SearchPage/Filters";
import type { Filters as FiltersType } from "@pages/SearchPage/Filters";
import EventList from "@pages/SearchPage/EventList";

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

  const query = searchParams.get("q") || "";

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

      <div className="search-content">
        <Filters filters={filters} setFilters={setFilters} />

        <EventList filters={filters} query={query} />
      </div>
    </div>
  );
}

export default SearchPage;
