import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Auth({ mode }) {
  const isLogin = mode === 'login';
  const { login, register } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      isLogin ? await login(f.email, f.password) : await register(f.name, f.email, f.password);
      nav(loc.state?.from || '/', { replace: true });
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  };
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  return (
    <div className="auth-wrap">
      <form className="auth glass" onSubmit={submit}>
        <p className="eyebrow">{isLogin ? 'Welcome back' : 'Join CineStore'}</p>
        <h1>{isLogin ? 'Sign in' : 'Create account'}</h1>
        {!isLogin && <input placeholder="Full name" value={f.name} onChange={set('name')} required />}
        <input type="email" placeholder="Email address" value={f.email} onChange={set('email')} required />
        <input type="password" placeholder="Password (min 6 chars)" value={f.password} onChange={set('password')} required minLength={6} />
        {error && <p className="error">{error}</p>}
        <button className="btn full" disabled={busy}>{busy ? 'Please wait…' : isLogin ? 'Login' : 'Register'}</button>
        <p className="muted center">
          {isLogin ? <>New here? <Link to="/register">Create an account</Link></> : <>Already registered? <Link to="/login">Login</Link></>}
        </p>
      </form>
    </div>
  );
}
