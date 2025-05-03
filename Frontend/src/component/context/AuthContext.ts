import { createContext } from "react";

type AuthContextType = {
  auth: boolean;
  handleAuth: () => void;
};

const AuthContext = createContext<AuthContextType>({
  auth: false,
  handleAuth: () => {},
});

export default AuthContext;
