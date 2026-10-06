import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context';

export default function ProtectedRoute({ role, children }) {
  const { user, loading, error, refresh } = useAuth();
  const location = useLocation();
  if (loading) return <section className="route-state" role="status"><span className="route-state__loader" /><p>Opening your NordWood account…</p></section>;
  if (!user && error && !error.includes('session has ended')) return <section className="route-state"><p className="eyebrow">A moment, please</p><h1>We couldn’t open your account.</h1><p role="alert">{error}</p><button onClick={() => refresh().catch(() => {})}>Try again</button><Link to="/login">Back to sign in</Link></section>;
  if (!user) return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  if (role && user.role !== role) return <section className="route-state"><p className="eyebrow">Team access</p><h1>This space is for our team.</h1><p>Your orders are ready to view in your account.</p><Link to="/account">Go to my account ↗</Link></section>;
  // Clear private page state if another tab signs into a different account.
  return cloneElement(children, { key: user.id });
}
import { cloneElement } from 'react';
