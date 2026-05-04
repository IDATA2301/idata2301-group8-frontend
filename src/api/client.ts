export const customFetch = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  const baseUrl = import.meta.env.VITE_API_URL || '';

  const res = await fetch(baseUrl + url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `API error: ${res.status}`);
  }

  const json = await res.json();

  return json.data;
};
