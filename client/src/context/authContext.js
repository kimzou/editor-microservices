import { createContext, useContext } from 'react';

// define auth context
export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);