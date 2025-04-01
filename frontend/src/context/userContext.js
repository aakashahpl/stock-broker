import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

// Custom hook to access user data from the context
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user from localStorage on mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const loginUser = (userData) => {
    if (!user) {
      console.log("Logging in user:", userData);
      localStorage.setItem("user", JSON.stringify(userData)); // Store in localStorage
      setUser(userData);
    }
  };

  const logoutUser = async () => {
    try {
      console.log("logoutUser runnign");
      await axios.get(`${process.env.NEXT_PUBLIC_Backend_URL}/user/logout`, {
        withCredentials: true, // Ensure cookies are sent with the request
      });
      localStorage.removeItem("user"); // Reqmove user from localStorage
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
