export const customFetch = async <T>(
  baseUrl: string,
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  const jwt = localStorage.getItem("jwt");
  const headers = new Headers(options.headers);
  const isFormData = options.body instanceof FormData;

  if (jwt) {
    headers.set("Authorization", `Bearer ${jwt}`);
  }

  if (!isFormData && options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(baseUrl + url, {
    ...options,
    headers,
    signal: AbortSignal.timeout(5000),
  });

  if (!res.ok) {
    const text = await res.text();
    throw {
      status: res.status,
      data: text || `API error: ${res.status}`,
      headers: res.headers,
    } as T;
  }

  let json: any;
  try {
    json = await res.json();
  } catch (e) {
    json = null;
  }

  return {
    status: res.status,
    data: json,
    headers: res.headers,
  } as T;
};

export const customFetchEventApi = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  return customFetch(import.meta.env.VITE_EVENT_API_URL, url, options);
};

export const customFetchIamApi = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  return customFetch(import.meta.env.VITE_IAM_API_URL, url, options);
};

export const customFetchOrderApi = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  return customFetch(import.meta.env.VITE_ORDER_API_URL, url, options);
};
