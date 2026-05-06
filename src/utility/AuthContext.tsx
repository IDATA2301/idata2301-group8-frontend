import { createContext, useContext, useState, type ReactNode } from 'react';
import { jwtDecode } from "jwt-decode";

interface User {
  sub: string;
  roles: {
    global: string[];
    company: Record<string, string[]>;
  };
  iat: number;
  exp: number;
}

export type AuthContextType = {
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (jwt: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const login = (jwt: string) => {
    localStorage.setItem("jwt", jwt);
    const decoded = jwtDecode(jwt) as User;
    setIsLoggedIn(true);
    setIsAdmin(decoded.roles.global.includes("admin"));
  }

  const logout = () => {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    setIsAdmin(false);
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
