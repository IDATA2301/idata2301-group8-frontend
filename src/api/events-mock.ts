import type { getEventsResponse200 } from "./events";

// MOCK DATA FOR TESTING
const mockEvents: getEventsResponse200 = {
  data: {
    totalElements: 2,
    totalPages: 1,
    size: 100,
    content: [
      {
        eventId: 1,
        eventName: "Mock Event 1",
        venueId: 1,
        categoryIds: [1],
        status: "active",
        venueName: "Mock Venue 1",
        createdAt: "2024-01-01T00:00:00Z",
      },
      {
        eventId: 2,
        eventName: "Mock Event 2",
        venueId: 2,
        categoryIds: [1, 2],
        status: "inactive",
        venueName: "Mock Venue 2",
        createdAt: "2024-02-01T00:00:00Z",
      },
    ],
  },
  status: 200,
};

const mockTicketListings = {
  data: [
    {
      ticketListingId: 1,
      eventId: 1,
      companyId: 1,
      ticketType: "VIP",
      price: 100,
      currency: "USD",
      ticketsAvailable: 10,
    },
    {
      ticketListingId: 2,
      eventId: 2,
      companyId: 2,
      ticketType: "Standard",
      price: 50,
      currency: "USD",
      ticketsAvailable: 20,
    },
  ],
  status: 200,
};

// Override useGetEvents to return mock data
export function useGetEvents<TData = typeof mockEvents, TError = string>(
  params?: any,
  options?: any,
  queryClient?: any,
): any {
  return {
    data: mockEvents,
    isLoading: false,
    isError: false,
    refetch: () => {},
    queryKey: ["mockEvents"],
  };
}

// Override useGetTicketListings to return mock data
export function useGetTicketListings<
  TData = typeof mockTicketListings,
  TError = string,
>(params?: any, options?: any, queryClient?: any): any {
  return {
    data: mockTicketListings,
    isLoading: false,
    isError: false,
    refetch: () => {},
    queryKey: ["mockTicketListings"],
  };
}
// Mock data for categories
const mockCategories = {
  data: [
    { categoryId: 1, categoryName: "Music" },
    { categoryId: 2, categoryName: "Sports" },
  ],
  status: 200,
};

// Mock data for venues
const mockVenues = {
  data: [
    {
      venueId: 1,
      venueName: "Venue A",
      venueCountry: "Norway",
      venueCity: "Oslo",
    },
    {
      venueId: 2,
      venueName: "Venue B",
      venueCountry: "Sweden",
      venueCity: "Stockholm",
    },
  ],
  status: 200,
};

// Override useGetAllCategories to return mock data
export function useGetAllCategories<
  TData = typeof mockCategories,
  TError = string,
>(options?: any, queryClient?: any): any {
  return {
    data: mockCategories,
    isLoading: false,
    isError: false,
    refetch: () => {},
    queryKey: ["mockCategories"],
  };
}

// Override useGetAllVenues to return mock data
export function useGetAllVenues<TData = typeof mockVenues, TError = string>(
  options?: any,
  queryClient?: any,
): any {
  return {
    data: mockVenues,
    isLoading: false,
    isError: false,
    refetch: () => {},
    queryKey: ["mockVenues"],
  };
}
