import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const profile = await authApi.me();
        setUser(profile);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = async (username, password) => {
    try {
      const data = await authApi.login({ username, password });
      setUser(data.profile);
      setError('');
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (payload) => {
    try {
      const data = await authApi.register(payload);
      setUser(data.profile);
      setError('');
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
    } finally {
      setError('');
    }
  };

  const value = useMemo(() => ({ user, loading, error, login, register, logout, setError }), [user, loading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
