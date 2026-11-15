import { useState } from "react";

const useAuth = () => {
const [isAuthenticated, setisAuthenticated] = useState(true)
  const user ={}
//   const isAuthenticated = true
  const logout = ()=>{
    setisAuthenticated(false)
  }

  return {
    user,
    isAuthenticated,
    logout
  };
};

export default useAuth;