// src/UserContext.jsx

import React, { createContext, useState, useContext } from 'react';

// Create the context
export const UserContext = createContext();

// Provider component
export function UserProvider({ children }) {
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem('user')) || null
  );

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to access user context
export function useUser() {
  return useContext(UserContext);
}
