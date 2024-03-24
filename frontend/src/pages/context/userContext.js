import React, { createContext, useContext, useState } from 'react';


const UserContext = createContext();

//  custom hook to access user data from the context
export const useUser = () => useContext(UserContext);


export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);


  const loginUser = (userData) => {
    setUser(userData);
  };


  const logoutUser = () => {
    setUser(null);
  };


  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};