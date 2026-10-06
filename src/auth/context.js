import { createContext, useContext } from 'react';

// A guest default supports the browser-independent blog renderer.
export const AuthContext = createContext({ user: null, loading: false, error: '' });
export const useAuth = () => useContext(AuthContext);
