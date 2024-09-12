import React, { createContext, useContext, useState,useEffect } from 'react';
import Cookies from "universal-cookie";
import jwt from "jsonwebtoken";
const UserContext = createContext();

//  custom hook to access user data from the context
export const useUser = () => useContext(UserContext);



 export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const cookies = new Cookies();


  useEffect(() => {
    const token = cookies.get("authorization");

    if (token && !user) {
      const payload = jwt.decode(token); 
      if (payload) {
        loginUser(payload.user);
      }
    }
  }, [user, cookies]);


  const loginUser = async (userData) => {
    if (!user) {
      // // console.log(userData);
      // const response = await axios.post(
      //   "http://localhost:3001/user/login",
      //   userData
      // );
      // cookies.set("authorization", response.data.accessToken, { path: "/" });
      setUser(userData);

    }
    else {
      return 1;
    }

  };


  const logoutUser = () => {

    setUser(null);
    return 1;
  };


  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};