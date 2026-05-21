import React, { useMemo, useState } from "react";
import x from "@assets/icons/x.svg";
import { useGetAllCategories, useGetAllVenues, useGetEvents } from "@api/events";

const MAX_VISIBLE_ITEMS = 10;

export type Filters = {
  categories: string[];
  startDateAfter: string;
  startDateBefore: string;
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
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);
  const [locationsExpanded, setLocationsExpanded] = useState(false);

  const { data: categoriesResponse } = useGetAllCategories();
  const { data: venuesResponse } = useGetAllVenues();

  // Fetch all future events to determine which categories/locations have events
  const currentTime = useMemo(() => new Date().toISOString(), []);
  const { data: eventsResponse } = useGetEvents({
    startDate: currentTime,
    size: 1000 // Large enough to get all future events
  });

  // Extract category IDs and venue IDs from future events
  const { activeCategoryIds, activeVenueIds } = useMemo(() => {
    if (eventsResponse?.status !== 200) {
      return { activeCategoryIds: new Set<number>(), activeVenueIds: new Set<number>() };
    }

    const events = eventsResponse.data.content ?? [];
    const categoryIds = new Set<number>();
    const venueIds = new Set<number>();

    for (const event of events) {
      if (event.categoryIds) {
        for (const id of event.categoryIds) {
          categoryIds.add(id);
        }
      }
      if (event.venueId) {
        venueIds.add(event.venueId);
      }
    }

    return { activeCategoryIds: categoryIds, activeVenueIds: venueIds };
  }, [eventsResponse]);

  const categories = useMemo(() => {
    if (categoriesResponse?.status !== 200) return [];

    return categoriesResponse.data
      .filter((c) => c.id !== undefined && activeCategoryIds.has(c.id))
      .map((c) => c.name)
      .filter((name): name is string => Boolean(name))
      .sort((a, b) => a.localeCompare(b));
  }, [categoriesResponse, activeCategoryIds]);

  const locations = useMemo(() => {
    if (venuesResponse?.status !== 200) return [];

    const cities = venuesResponse.data
      .filter((v) => v.id !== undefined && activeVenueIds.has(v.id))
      .map((v) => v.city)
      .filter((city): city is string => Boolean(city));

    return [...new Set(cities)].sort((a, b) => a.localeCompare(b));
  }, [venuesResponse, activeVenueIds]);

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

        {(categoriesExpanded ? categories : categories.slice(0, MAX_VISIBLE_ITEMS)).map((cat) => (
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

        {categories.length > MAX_VISIBLE_ITEMS && (
          <button
            type="button"
            className="filter-expand-button"
            onClick={() => setCategoriesExpanded((prev) => !prev)}
          >
            {categoriesExpanded ? "Show less" : `Show all (${categories.length})`}
          </button>
        )}
      </div>

      <div className="filter-section">
        <h4>Dates</h4>

        <div className="date-row">
          <label>Event start after</label>
          <div className="date-input-wrapper">
            <button
              type="button"
              className={`date-clear-button ${filters.startDateAfter ? "date-clear-button-visible" : ""}`}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  startDateAfter: ""
                }))
              }
              aria-label="Clear start date after"
              tabIndex={filters.startDateAfter ? 0 : -1}
            >
              <img src={x} alt="" />
            </button>
            <input
              type="date"
              value={filters.startDateAfter}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  startDateAfter: e.target.value
                }))
              }
            />
          </div>
        </div>

        <div className="date-row">
          <label>Event start before</label>
          <div className="date-input-wrapper">
            <button
              type="button"
              className={`date-clear-button ${filters.startDateBefore ? "date-clear-button-visible" : ""}`}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  startDateBefore: ""
                }))
              }
              aria-label="Clear start date before"
              tabIndex={filters.startDateBefore ? 0 : -1}
            >
              <img src={x} alt="" />
            </button>
            <input
              type="date"
              value={filters.startDateBefore}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  startDateBefore: e.target.value
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

        {(locationsExpanded ? locations : locations.slice(0, MAX_VISIBLE_ITEMS)).map((loc) => (
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

        {locations.length > MAX_VISIBLE_ITEMS && (
          <button
            type="button"
            className="filter-expand-button"
            onClick={() => setLocationsExpanded((prev) => !prev)}
          >
            {locationsExpanded ? "Show less" : `Show all (${locations.length})`}
          </button>
        )}
      </div>
    </div>
  );
};

export default Filters;
