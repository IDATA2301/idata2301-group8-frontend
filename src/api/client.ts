export const createCustomFetch = (baseUrl: string) => {
  return async <T>(url: string, options: RequestInit = {}): Promise<T> => {
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
};

export const customFetchEventApi = createCustomFetch(import.meta.env.VITE_EVENT_API_URL || '');
export const customFetchIamApi = createCustomFetch(import.meta.env.VITE_IAM_API_URL || '');
export const customFetchOrderApi = createCustomFetch(import.meta.env.VITE_ORDER_API_URL || '');
