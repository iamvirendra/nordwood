import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/context';
import { api } from '../lib/api';
import { useMotion } from '../motion/MotionContext';
import './Auth.css';

const pageCopy = {
  login: { eyebrow: 'Your personal NordWood space', title: <>Welcome <em>home.</em></>, intro: 'A place for your orders, your details, and everything taking shape.', action: 'Sign in', busy: 'Signing you in…', imageTitle: <>Every beautiful home<br />starts with <em>a welcome.</em></> },
  signup: { eyebrow: 'A new beginning', title: <>Make yourself <em>at home.</em></>, intro: 'Create your account. Keep your orders and the details that matter, together.', action: 'Create account', busy: 'Creating your account…', imageTitle: <>Good things begin<br />with <em>an open door.</em></> },
  'forgot-password': { eyebrow: 'A little help getting home', title: <>Find your <em>way back.</em></>, intro: 'Enter the email you use for NordWood. We’ll send you a link to reset your password.', action: 'Send reset link', busy: 'Sending your request…', imageTitle: <>Your next chapter<br />is <em>waiting inside.</em></> },
  'reset-password': { eyebrow: 'A fresh start', title: <>A new key.<br /><em>The same home.</em></>, intro: 'Choose a new password to get back to your NordWood account.', action: 'Save new password', busy: 'Saving your password…', imageTitle: <>Thoughtful details.<br /><em>Peace of mind.</em></> },
};

function Icon({ name, className = '', size = 20 }) {
  const paths = {
    arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
    back: <path d="M20 12H5m6-6-6 6 6 6" />,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 6 9 7 9-7" /></>,
    user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 21v-2a7 7 0 0 1 14 0v2" /></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2" /></>,
    eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
    hidden: <><path d="m3 3 18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a19 19 0 0 1-3.3 4.2M6.3 6.4A21 21 0 0 0 2 12s3.5 7 10 7c1.8 0 3.4-.5 4.8-1.3M10 10a3 3 0 0 0 4 4" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    door: <><path d="M6 21V3h12v18M3 21h18M6 3l9 3v15" /><path d="M12 12h.01" /></>,
  };
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function safeDestination(search, user) {
  const fallback = user?.role === 'admin' ? '/admin' : '/account';
  const candidate = new URLSearchParams(search).get('redirect');
  if (!candidate || !candidate.startsWith('/') || candidate.startsWith('//') || candidate.includes('\\')) return fallback;
  try {
    const parsed = new URL(candidate, window.location.origin);
    if (parsed.origin !== window.location.origin || /^\/(login|signup|forgot-password|reset-password)\/?$/.test(parsed.pathname)) return fallback;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch { return fallback; }
}

function PasswordField({ id, label, value, onChange, error, description, autoComplete = 'new-password', disabled }) {
  const [visible, setVisible] = useState(false);
  return <div className={`auth-field ${error ? 'has-error' : ''}`}>
    <label htmlFor={id}>{label}</label>
    <div className="auth-input-wrap">
      <Icon name="lock" />
      <input id={id} name={id} type={visible ? 'text' : 'password'} value={value} onChange={onChange} autoComplete={autoComplete} maxLength={128} required disabled={disabled} aria-invalid={Boolean(error)} aria-describedby={[description, error && `${id}-error`].filter(Boolean).join(' ') || undefined} placeholder={autoComplete === 'current-password' ? 'Enter your password' : 'At least 8 characters'} />
      <button className="auth-password-toggle" type="button" onClick={() => setVisible(current => !current)} aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`} aria-pressed={visible} disabled={disabled}><Icon name={visible ? 'hidden' : 'eye'} size={19} /></button>
    </div>
    {error && <p className="auth-field-error" id={`${id}-error`}>{error}</p>}
  </div>;
}

function PasswordGuidance({ password }) {
  const longEnough = password.length >= 8;
  const varied = [/[a-z]/, /[A-Z]/, /\d/, /[^a-zA-Z\d]/].filter(pattern => pattern.test(password)).length;
  const level = !password ? 0 : !longEnough ? 1 : password.length >= 16 && varied >= 3 ? 4 : varied >= 3 ? 3 : 2;
  const label = ['Make it personal. Keep it private.', 'Keep going — use at least 8 characters.', 'Good start — a longer phrase is even better.', 'Strong password.', 'A strong, thoughtful choice.'][level];
  return <div className="auth-password-guidance" id="auth-password-guidance">
    <div className="auth-strength-bars" data-level={level} aria-hidden="true">{[1, 2, 3, 4].map(segment => <span className={segment <= level ? 'is-filled' : ''} key={segment} />)}</div>
    <p>{label}</p><span>8–128 characters. Try a few unrelated words.</span>
  </div>;
}

function AuthExperience({ mode }) {
  const { enabled: motionEnabled } = useMotion();
  const { user, loading, error: sessionError, login, signup, refresh } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: '', email: '', password: '', confirm: '', remember: false });
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [complete, setComplete] = useState(false);
  const feedback = useRef(null);
  const glass = useRef(null);
  const reflectionFrame = useRef(null);
  const isSignup = mode === 'signup';
  const isLogin = mode === 'login';
  const isForgot = mode === 'forgot-password';
  const isReset = mode === 'reset-password';
  const hasNewPassword = isSignup || isReset;
  const copy = pageCopy[mode];
  const token = new URLSearchParams(location.hash.slice(1)).get('token') || new URLSearchParams(location.search).get('token');
  const redirect = new URLSearchParams(location.search).get('redirect');
  const redirectSearch = redirect ? `?redirect=${encodeURIComponent(redirect)}` : '';
  const missingToken = isReset && !token;
  const displayedError = message || ((isLogin || isSignup) && sessionError);

  useEffect(() => {
    if (!loading && user && (isLogin || isSignup)) navigate(safeDestination(location.search, user), { replace: true });
  }, [user, loading, isLogin, isSignup, location.search, navigate]);

  useEffect(() => {
    if (message || complete) feedback.current?.focus({ preventScroll: true });
  }, [message, complete]);

  useEffect(() => () => window.cancelAnimationFrame(reflectionFrame.current), []);

  const moveReflection = event => {
    if (!motionEnabled || event.pointerType !== 'mouse' || !glass.current) return;
    const rect = glass.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    window.cancelAnimationFrame(reflectionFrame.current);
    reflectionFrame.current = window.requestAnimationFrame(() => {
      glass.current?.style.setProperty('--reflection-x', `${x}%`);
      glass.current?.style.setProperty('--reflection-y', `${y}%`);
    });
  };

  const resetReflection = () => {
    window.cancelAnimationFrame(reflectionFrame.current);
    glass.current?.style.removeProperty('--reflection-x');
    glass.current?.style.removeProperty('--reflection-y');
  };

  const update = field => event => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setValues(current => ({ ...current, [field]: value }));
    setErrors(current => ({ ...current, [field]: undefined }));
    if (message) setMessage('');
  };

  const submit = async event => {
    event.preventDefault();
    if (busy || loading || missingToken) return;
    const nextErrors = {};
    if (isSignup && (values.name.trim().length < 2 || values.name.trim().length > 100)) nextErrors.name = 'Please enter a name between 2 and 100 characters.';
    if (!isReset && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) nextErrors.email = 'Please enter a valid email address.';
    if (hasNewPassword && (values.password.length < 8 || values.password.length > 128)) nextErrors.password = 'Use a password between 8 and 128 characters.';
    if (isLogin && !values.password) nextErrors.password = 'Please enter your password.';
    if (hasNewPassword && values.confirm !== values.password) nextErrors.confirm = 'Your passwords don’t match yet.';
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      document.getElementById(`auth-${Object.keys(nextErrors)[0]}`)?.focus();
      return;
    }
    setBusy(true);
    setMessage('');
    setErrors({});
    try {
      if (isLogin || isSignup) {
        const authenticated = isLogin
          ? await login({ email: values.email.trim(), password: values.password, remember: values.remember })
          : await signup({ name: values.name.trim(), email: values.email.trim(), password: values.password });
        navigate(safeDestination(location.search, authenticated), { replace: true });
      } else if (isForgot) {
        await api('/auth/forgot-password', { method: 'POST', body: { email: values.email.trim() } });
        setComplete(true);
      } else {
        await api('/auth/reset-password', { method: 'POST', body: { token, password: values.password } });
        // A completed password reset stays successful even if the follow-up session read is interrupted.
        await refresh().catch(() => {});
        setValues(current => ({ ...current, password: '', confirm: '' }));
        setComplete(true);
      }
    } catch (error) {
      setMessage(error.message || 'We couldn’t complete that request. Please try again.');
      if (error.fields && typeof error.fields === 'object') {
        setErrors(error.fields);
      }
    } finally { setBusy(false); }
  };

  return <section className={`auth-page auth-page--${mode}`} aria-labelledby="auth-title">
    <div className="auth-topline"><Link to="/shop"><Icon name="back" size={16} />Back to the collection</Link><span>A LITTLE CLOSER TO HOME</span></div>
    <div className="auth-layout">
      <div className="auth-scene" aria-hidden="true">
        <img className="auth-scene-photo" src="/images/nordwood-teak-entry.jpg" width="1536" height="1024" alt="" fetchPriority="high" />
        <div className="auth-scene-shade" />
        <span className="auth-light auth-light--warm" /><span className="auth-light auth-light--soft" />
        <div className="auth-scene-lines"><span /><span /><span /></div>
      </div>
      <aside className="auth-story" aria-label="Welcome to NordWood">
        <div className="auth-story-top"><span><Icon name="door" size={26} /></span><p>ROOTED IN CRAFT.<br />MADE FOR YOUR HOME.</p></div>
        <div className="auth-story-content"><p className="auth-story-eyebrow"><span />THE ART OF FEELING AT HOME</p><h2>{copy.imageTitle}</h2><p>Natural materials. Thoughtful details.<br />Your story, beautifully connected.</p><div className="auth-story-signature"><span aria-hidden="true" /><p>Wood. Warmth. Welcome.</p></div></div>
        <div className="auth-story-footer"><span className="auth-story-seal"><Icon name="lock" size={17} /></span><p>A personal space.<br /><strong>A lasting connection.</strong></p><span className="auth-story-edition" aria-hidden="true">WOODWORK<br />WITH WARMTH</span></div>
      </aside>
      <div className="auth-panel" ref={glass} onPointerMove={moveReflection} onPointerLeave={resetReflection}>
        <span className="auth-glass-edge" aria-hidden="true" />
        <div className="auth-panel-inner">
          {(isLogin || isSignup) && <nav className="auth-tabs" aria-label="Your account"><Link to={`/login${redirectSearch}`} className={isLogin ? 'is-active' : ''} aria-current={isLogin ? 'page' : undefined}>Sign in</Link><Link to={`/signup${redirectSearch}`} className={isSignup ? 'is-active' : ''} aria-current={isSignup ? 'page' : undefined}>Create account</Link><span className={isSignup ? 'is-signup' : ''} aria-hidden="true" /></nav>}
          {(isForgot || isReset) && <Link className="auth-back-link" to={`/login${redirectSearch}`}><Icon name="back" size={17} />Back to sign in</Link>}
          <header className="auth-heading"><p className="auth-eyebrow"><span />{copy.eyebrow}</p><h1 id="auth-title">{copy.title}</h1><p>{copy.intro}</p></header>
          {complete ? <div className="auth-success" role="status" ref={feedback} tabIndex={-1}>
            <div className="auth-success-icon"><Icon name={isForgot ? 'mail' : 'check'} size={30} /></div>
            <h2>{isForgot ? 'Check your inbox.' : 'Your new key is ready.'}</h2>
            <p>{isForgot ? <>If an account exists for <strong>{values.email.trim()}</strong>, you’ll receive a password reset link shortly. Check your spam folder too.</> : 'Your password has been updated. Sign in with your new password to continue.'}</p>
            <Link className="auth-submit" to={`/login${redirectSearch}`}>Back to sign in<Icon name="arrow" /></Link>
            {isForgot && <button className="auth-inline-link auth-try-again" onClick={() => setComplete(false)} type="button">Use a different email address</button>}
          </div> : <form className="auth-form" onSubmit={submit} noValidate aria-busy={busy}>
            {missingToken && <div className="auth-error" role="alert"><p>This reset link is incomplete. Request a new link to continue.</p><Link className="auth-inline-link" to="/forgot-password">Request a new reset link<Icon name="arrow" size={16} /></Link></div>}
            {displayedError && <div className="auth-error" role="alert" ref={feedback} tabIndex={-1}><p>{displayedError}</p>{isReset && <Link className="auth-inline-link" to="/forgot-password">Request a new reset link<Icon name="arrow" size={16} /></Link>}</div>}
            {isSignup && <div className={`auth-field ${errors.name ? 'has-error' : ''}`}><label htmlFor="auth-name">Full name</label><div className="auth-input-wrap"><Icon name="user" /><input id="auth-name" name="name" type="text" autoComplete="name" placeholder="Your full name" value={values.name} onChange={update('name')} maxLength={100} required disabled={busy} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'auth-name-error' : undefined} /></div>{errors.name && <p className="auth-field-error" id="auth-name-error">{errors.name}</p>}</div>}
            {!isReset && <div className={`auth-field ${errors.email ? 'has-error' : ''}`}><label htmlFor="auth-email">Email address</label><div className="auth-input-wrap"><Icon name="mail" /><input id="auth-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={values.email} onChange={update('email')} maxLength={254} required disabled={busy} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'auth-email-error' : undefined} autoCapitalize="none" spellCheck={false} /></div>{errors.email && <p className="auth-field-error" id="auth-email-error">{errors.email}</p>}</div>}
            {!isForgot && <PasswordField id="auth-password" label={isReset ? 'New password' : 'Password'} value={values.password} onChange={update('password')} error={errors.password} description={hasNewPassword ? 'auth-password-guidance' : undefined} autoComplete={isLogin ? 'current-password' : 'new-password'} disabled={busy || missingToken} />}
            {hasNewPassword && <PasswordGuidance password={values.password} />}
            {hasNewPassword && <PasswordField id="auth-confirm" label="Confirm password" value={values.confirm} onChange={update('confirm')} error={errors.confirm} disabled={busy || missingToken} />}
            {isLogin && <div className="auth-options"><label className="auth-checkbox"><input type="checkbox" name="remember" checked={values.remember} onChange={update('remember')} disabled={busy} /><span className="auth-checkbox-box" aria-hidden="true"><Icon name="check" size={12} /></span><span>Remember me</span></label><Link className="auth-inline-link" to={`/forgot-password${redirectSearch}`}>Forgot password?</Link></div>}
            <button className="auth-submit" type="submit" disabled={busy || loading || missingToken}><span>{busy ? copy.busy : loading ? 'Preparing your account…' : copy.action}</span>{busy || loading ? <span className="auth-spinner" aria-hidden="true" /> : <Icon name="arrow" />}</button>
            {isSignup && <p className="auth-form-note">Your own space to follow orders and stay connected with NordWood.</p>}
          </form>}
          {!complete && (isLogin || isSignup) && <p className="auth-switch">{isLogin ? 'New to NordWood?' : 'Already feel at home?'} <Link to={`${isLogin ? '/signup' : '/login'}${redirectSearch}`}>{isLogin ? 'Create an account' : 'Sign in'}<Icon name="arrow" size={16} /></Link></p>}
          <div className="auth-reassurance"><Icon name="lock" size={15} /><span>Your space. Your details. Securely kept.</span><span className="auth-reassurance-line" /></div>
        </div>
      </div>
    </div>
    <div className="auth-bottomline"><span>MADE WITH CARE. BUILT ON TRUST.</span><Link to="/contact">Need a hand? Talk to our team <Icon name="arrow" size={16} /></Link></div>
  </section>;
}

export default function Auth({ mode = 'login' }) {
  const location = useLocation();
  const normalized = ({ forgot: 'forgot-password', reset: 'reset-password' })[mode] || mode;
  const activeMode = pageCopy[normalized] ? normalized : 'login';
  return <AuthExperience key={`${activeMode}:${activeMode === 'reset-password' ? location.hash || location.search : ''}`} mode={activeMode} />;
}
