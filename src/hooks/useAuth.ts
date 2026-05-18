import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'aquiyahora2025';
const AUTH_KEY = 'admin_auth';

export function useAuth() {
  const [auth, setAuth] = useLocalStorage<{ authenticated: boolean; expires: number } | null>(AUTH_KEY, null);
  const [showLogin, setShowLogin] = useState(false);

  const isAuthenticated = auth?.authenticated === true && auth?.expires > Date.now();

  const login = useCallback((password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setAuth({ authenticated: true, expires: Date.now() + 24 * 60 * 60 * 1000 });
      setShowLogin(false);
      return true;
    }
    return false;
  }, [setAuth]);

  const logout = useCallback(() => {
    setAuth(null);
  }, [setAuth]);

  const openLogin = useCallback(() => {
    if (isAuthenticated) {
      setShowLogin(false);
      return true;
    }
    setShowLogin(true);
    return false;
  }, [isAuthenticated]);

  const closeLogin = useCallback(() => {
    setShowLogin(false);
  }, []);

  return { isAuthenticated, showLogin, login, logout, openLogin, closeLogin };
}
