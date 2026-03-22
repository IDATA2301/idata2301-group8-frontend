import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from "axios";
import "./style.css"


import SearchBar from '@pages/SearchPage/SearchBar';
import Filters from "@pages/SearchPage/Filters";
import type { Filters as FiltersType } from "@pages/SearchPage/Filters";
import EventList from '@pages/SearchPage/EventList';

function SearchPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const queryParam = params.get('q') || '';

  const [query, setQuery] = useState(queryParam);

  const [filters, setFilters] = useState<FiltersType>({
    categories: [],
    startDate: "",
    endDate: "",
    priceMin: 0,
    priceMax: 9999,
    locations: []
  });

  type Event = {
    id: string;
    title: string;
    image: string;
    category: string;
    location: string;
    date: string;
    price: number;
  };

  const [results, setResults] = useState<Event[]>([]);

  useEffect(() => {
    fetchResults();
  }, [filters, query]);

  const fetchResults = async () => {
    const res = await axios.get<Event[]>("/api/events", {
      params: { ...filters, q: query }
    });
    setResults(res.data);
  };

  return (
    <div className="search-page">
      <SearchBar query={query} setQuery={setQuery} />

      <div className="search-content">
        <Filters filters={filters} setFilters={setFilters} />
        <EventList events={results} />
      </div>
    </div>
  );
}

export default SearchPage;
