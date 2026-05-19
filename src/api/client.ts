import { jwtDecode } from "jwt-decode";

type JwtClaims = {
  exp: number;
};

const getStoredJwt = () => localStorage.getItem("jwt");

const isExpired = (jwt: string) => {
  try {
    const decoded = jwtDecode<JwtClaims>(jwt);
    return decoded.exp < Date.now() / 1000;
  } catch {
    return true;
  }
};

let refreshInFlight: Promise<string | null> | null = null;

const refreshJwt = async (): Promise<string | null> => {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_IAM_API_URL}/refresh`, {
          method: "POST",
          credentials: "include",
          signal: AbortSignal.timeout(5000),
        });

        if (!res.ok) {
          return null;
        }

        const data = await res.json();
        const jwt = data?.jwt;
        if (typeof jwt !== "string" || jwt.length === 0) {
          return null;
        }

        localStorage.setItem("jwt", jwt);
        return jwt;
      } catch {
        return null;
      }
    })().finally(() => {
      refreshInFlight = null;
    });
  }

  return refreshInFlight;
};

export const customFetch = async <T>(
  baseUrl: string,
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  const isRefreshEndpoint = url === "/refresh";

  let jwt = getStoredJwt();

  if (jwt && isExpired(jwt) && !isRefreshEndpoint) {
    jwt = await refreshJwt();
    if (!jwt) {
      localStorage.removeItem("jwt");
      throw {
        status: 401,
        data: "Session expired. Please log in again.",
      } as T;
    }
  }

  const res = await fetch(baseUrl + url, {
    ...options,
    ...(isRefreshEndpoint ? { credentials: "include" } : {}),
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(!isRefreshEndpoint && jwt ? { Authorization: `Bearer ${jwt}` } : {}),
    },
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
