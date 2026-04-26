const BASE_URL = "http://localhost:8080";

export type Event = {
  slug: string;
  title: string;
  description: string;
};

export const fetchEvents = async (): Promise<Event[]> => {
  const res = await fetch(`${BASE_URL}/events`);

  if (!res.ok) {
    throw new Error('Failed to fetch events');
  }

  const data = await res.json();

  return data.map((e: any) => ({
    slug: e.slug,
    title: e.eventName,
    description: e.description
  }));
};
