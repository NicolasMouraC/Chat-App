import { createContext, useContext } from "react";
import AuthType from "../types/auth/AuthType";

export const AuthContext = createContext<AuthType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("AuthProvider Error");
  }
  return context;
};
