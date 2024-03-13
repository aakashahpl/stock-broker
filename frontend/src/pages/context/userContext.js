import React, { createContext, useContext, useState } from 'react';

// Create a context for managing user data
const UserContext = createContext();

// Create a custom hook to access user data from the context
export const useUser = () => useContext(UserContext);

// UserProvider component to wrap around the components needing user data
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Function to set user data
  const loginUser = (userData) => {
    setUser(userData);
  };

  // Function to log out user
  const logoutUser = () => {
    setUser(null);
  };

  // Expose the user data and functions for login/logout through context
  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};