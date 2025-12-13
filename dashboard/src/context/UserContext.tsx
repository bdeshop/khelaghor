import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { getCurrentUser } from "../config/api";

interface User {
  id?: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  fetchUser: () => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getCurrentUser();
      console.log("=== API Response ===", response);
      console.log("Response type:", typeof response);
      console.log("Response keys:", Object.keys(response));

      // Handle response structure: { success: true, user: {...} }
      const userData = response.user || response;
      console.log("=== Extracted user data ===", userData);
      console.log("User data type:", typeof userData);
      console.log("User data keys:", userData ? Object.keys(userData) : "null");
      console.log("User name:", userData?.name);
      console.log("User email:", userData?.email);

      setUser(userData);
      console.log("User state set successfully");
    } catch (error) {
      console.error("Failed to fetch user:", error);
      // Clear invalid token
      localStorage.removeItem("authToken");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading, fetchUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
