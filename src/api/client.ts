import { jwtDecode } from "jwt-decode";

type JwtClaims = {
  exp: number;
}

function getJwt(): string | null {
  return localStorage.getItem("jwt");
}

function isJwtExpired(jwt: string): boolean {
  const decoded = jwtDecode<JwtClaims>(jwt);
  const now = Math.floor(Date.now() / 1000);
  return decoded.exp < now;
}

async function refreshJwt(): Promise<string | null> {
  try {
    const res = await fetch(import.meta.env.VITE_IAM_API_URL + "/refresh", {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) {
      console.error("Failed to refresh JWT:", res.status, await res.text());
      return null;
    }
    const data = await res.json();
    localStorage.setItem("jwt", data.jwt);
    return data.jwt;
  } catch (e) {
    console.error("Failed to refresh JWT:", e);
    return null;
  }
}

export const customFetch = async <T>(
  baseUrl: string,
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  const isRefreshRequest = url === "/refresh";

  let jwt = getJwt();
  const isLoggedIn = !!jwt;

  if (!isRefreshRequest && isLoggedIn && isJwtExpired(jwt!)) {
    jwt = await refreshJwt();
    if (!jwt) {
      throw {
        status: 401,
        data: "Unauthorized: JWT expired and refresh failed",
      } as T;
    }
  }

  const res = await fetch(baseUrl + url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(!isRefreshRequest && isLoggedIn ? { Authorization: `Bearer ${jwt}` } : {}),
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
