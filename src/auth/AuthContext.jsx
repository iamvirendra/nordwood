import { useCallback, useEffect, useMemo, useState } from 'react';
import { api, getSession } from '../lib/api';
import { AuthContext } from './context';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const refresh = useCallback(async () => {
    try {
      const data = await getSession();
      setUser(data.user);
      setError('');
      return data.user;
    } catch (failure) {
      setError(failure.message);
      throw failure;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // The asynchronous request synchronizes the cookie session with React.
    // eslint-disable-next-line react/set-state-in-effect
    refresh().catch(() => {});
    const expire = () => { setUser(null); setError('Your session has ended. Please sign in again.'); };
    const update = event => { setUser(event.detail); setError(''); };
    window.addEventListener('nordwood:session-expired', expire);
    window.addEventListener('nordwood:session-updated', update);
    return () => {
      window.removeEventListener('nordwood:session-expired', expire);
      window.removeEventListener('nordwood:session-updated', update);
    };
  }, [refresh]);

  const login = useCallback(async values => {
    const data = await api('/auth/login', { method: 'POST', body: values });
    setUser(data.user);
    setError('');
    return data.user;
  }, []);
  const signup = useCallback(async values => {
    const data = await api('/auth/signup', { method: 'POST', body: values });
    setUser(data.user);
    setError('');
    return data.user;
  }, []);
  const logout = useCallback(async () => {
    await api('/auth/logout', { method: 'POST' });
    setUser(null);
    setError('');
  }, []);
  const value = useMemo(() => ({ user, loading, error, refresh, login, signup, logout }), [user, loading, error, refresh, login, signup, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
