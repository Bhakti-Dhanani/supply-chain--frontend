import { useState } from 'react';
import { login } from '../apis/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const authenticate = async (credentials: { email: string; password: string }) => {
    setLoading(true);
    try {
      const data = await login(credentials);
      setUser(data);
    } catch (error) {
      console.error('Authentication failed', error);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, authenticate };
};
