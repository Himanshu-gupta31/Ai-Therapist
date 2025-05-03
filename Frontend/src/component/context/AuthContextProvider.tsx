import  { useState, useEffect, ReactNode } from "react";
import AuthContext from "./AuthContext";
import { newRequest } from "@/utils/request";

type AuthContextProviderProps = {
  children: ReactNode;
};

const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [auth, setAuth] = useState<boolean>(false);

  const handleAuth = async () => {
    try {
      const response = await newRequest.get("/users/verify");
      setAuth(response.status === 200);
    } catch (error) {
      setAuth(false);
    }
  };

  useEffect(() => {
    handleAuth(); 
  }, []);

  return (
    <AuthContext.Provider value={{ auth, handleAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
