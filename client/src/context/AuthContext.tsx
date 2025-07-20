import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import Cookies from "js-cookie";

export type UserType = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  theme?: "light" | "dark";
};

type AuthContextType = {
  user: UserType | null;
  token: string | null;
  theme: "light" | "dark";
  login: (user: UserType, token: string) => void;
  logout: () => void;
  setTheme: (theme: "light" | "dark") => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [theme, setThemeState] = useState<"light" | "dark">("light");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    console.log(prefersDark);
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setThemeState(parsedUser.theme || "light");
    } else {
      setThemeState(prefersDark ? "dark" : "light");
    }

    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const login = (user: UserType, token: string) => {
    setUser(user);
    setToken(token);
    setThemeState(user.theme || "light");
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  };
  // const navigate = useNavigate();

  const logout = async () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
    Cookies.remove("user");
    Cookies.remove("token");
  };

  const setTheme = (newTheme: "light" | "dark") => {
    setThemeState(newTheme);
    if (user) {
      const updatedUser = { ...user, theme: newTheme };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  console.log("AuthProvider rendered with user:", user);
  return (
    <AuthContext.Provider
      value={{ user, token, theme, login, logout, setTheme }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuthContext must be used inside AuthProvider");
  return context;
};
