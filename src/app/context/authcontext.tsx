"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type ProviderUser = {
  id: string;
  name: string;
  phone: string;
} | null;

type AuthContextType = {
  isLoggedIn: boolean;
  user: ProviderUser;
  loginProvider: (user: NonNullable<ProviderUser>) => void;
  logoutProvider: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<ProviderUser>(null);

  // ✅ Load saved login & user info
  useEffect(() => {
    const storedLogin = localStorage.getItem("providerLoggedIn");
    const storedUser = localStorage.getItem("providerUser");
    if (storedLogin === "true" && storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ Login function (now accepts user info)
  const loginProvider = (userData: NonNullable<ProviderUser>) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem("providerLoggedIn", "true");
    localStorage.setItem("providerUser", JSON.stringify(userData));
  };

  // ✅ Logout function
  const logoutProvider = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("providerLoggedIn");
    localStorage.removeItem("providerUser");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, loginProvider, logoutProvider }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
