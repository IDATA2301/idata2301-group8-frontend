import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import axios from "axios";
import "./style.css"
import "@utility/ScrollToTop"

import SearchBar from '@pages/SearchPage/SearchBar';
import Filters from "@pages/SearchPage/Filters";
import type { Filters as FiltersType } from "@pages/SearchPage/Filters";
import EventList from '@pages/SearchPage/EventList';

function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();

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

  const { data: results = [], isLoading, error } = useQuery({
    queryKey: ['events', filters, query],
    queryFn: async () => {
      const res = await axios.get<Event[]>("/api/events", {
        params: { ...filters, q: query }
      });
      return res.data;
    }
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);

    navigate(`?${params.toString()}`, { replace: true });
  }, [query, navigate]);

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
