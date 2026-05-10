import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { jwtDecode } from "jwt-decode";

export type GlobalRole = "ADMIN" | "USER";

export type CompanyRole = "ADMIN";

type JwtClaims = {
  sub: string;
  email: string;
  roles: {
    global: GlobalRole[];
    company: Record<string, CompanyRole[]>;
  };
  iat: number;
  exp: number;
}

export type User = {
  id: string;
  email: string;
  globalRoles: GlobalRole[];
  companyRoles: Record<string, CompanyRole[]>;
}

type AuthContextLoggedOut = {
  isLoggedIn: false;
  isAdmin?: boolean;
  isProvider?: boolean;
  user?: User;
  login: (jwt: string) => void;
  logout: () => void;
};

type AuthContextLoggedIn = {
  isLoggedIn: true;
  isAdmin: boolean;
  isProvider: boolean;
  user: User;
  login: (jwt: string) => void;
  logout: () => void;
};

export type AuthContextType = AuthContextLoggedOut | AuthContextLoggedIn;

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthState =
  | { isLoggedIn: false }
  | {
    isLoggedIn: true;
    isAdmin: boolean;
    isProvider: boolean;
    user: User;
  };

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({ isLoggedIn: false });

  const login = (jwt: string) => {
    const decoded = jwtDecode<JwtClaims>(jwt);

    if (decoded.exp < Date.now() / 1000) {
      throw new Error("Expired token");
    }

    const user: User = {
      id: decoded.sub,
      email: decoded.email,
      globalRoles: decoded.roles.global,
      companyRoles: decoded.roles.company,
    };

    localStorage.setItem("jwt", jwt);

    setAuthState({
      isLoggedIn: true,
      isAdmin: user.globalRoles.includes("ADMIN"),
      isProvider: Object.keys(user.companyRoles).length > 0,
      user,
    });
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    setAuthState({ isLoggedIn: false });
  }

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      try {
        login(jwt);
      } catch {
        logout();
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
