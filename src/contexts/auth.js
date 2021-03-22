import { createContext, useContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  token: null,
  login: () => {},
  logout: () => {},
  role: "",
  id: 0,
});

export function useAuth() {
  return useContext(AuthContext);
}
