import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import "./style.css";
import "@utility/ScrollToTop";

import SearchBar from '@pages/SearchPage/SearchBar';
import Filters from "@pages/SearchPage/Filters";
import type { Filters as FiltersType } from "@pages/SearchPage/Filters";
import EventList from '@pages/SearchPage/EventList';

type Event = {
  id: string;
  title: string;
  image: string;
  category: string;
  location: string;
  date: string;
  price: number;
};

async function typedFetch<T>(url: string, params?: Object, options?: RequestInit): Promise<T> {
  if (params) {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });

    url = `${url}?${searchParams.toString()}`;
  }

  const response = await fetch(url, options);
  return response.json();
}

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

  const { data: results = [], isLoading, error } = useQuery({
    queryKey: ['events', filters, query],
    queryFn: () =>
      typedFetch<Event[]>("/api/events", { ...filters, q: query })
  });

  return (
    <div className="search-page">
      <SearchBar query={query} setQuery={setQuery} />

      <div className="search-content">
        <Filters filters={filters} setFilters={setFilters} />

        {isLoading && <p>Loading...</p>}
        {error && <p>Something went wrong</p>}
        {!isLoading && !error && <EventList events={results} />}
      </div>
    </div>
  );
}

export default SearchPage;
