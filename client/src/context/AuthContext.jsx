import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios
        .get('/api/users/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setUser(res.data.user))
        .catch(() => {
          setToken(null);
          setUser(null);
          localStorage.removeItem('token');
        });
    }
  }, [token]);

  const login = (nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem('token', nextToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return <AuthContext.Provider value={{ user, setUser, token, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
