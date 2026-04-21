import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import "./style.css";
import "@utility/ScrollToTop";

import SearchBar from '@pages/SearchPage/SearchBar';
import Filters from "@pages/SearchPage/Filters";
import type { Filters as FiltersType } from "@pages/SearchPage/Filters";
import EventList from '@pages/SearchPage/EventList';

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") || "";

  const setQuery = (value: string) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);

      if (value) newParams.set("q", value);
      else newParams.delete("q");

      return newParams;
    }, { replace: true });
  };

  const [filters, setFilters] = useState<FiltersType>({
    categories: [],
    startDate: "",
    endDate: "",
    priceMin: 0,
    priceMax: 9999,
    locations: []
  });


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
