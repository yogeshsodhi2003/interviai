// src/components/Login.tsx
import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function handleEmailLogin(e) {
    e.preventDefault();
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      nav('/');
    } catch (e) {
      setErr(e.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      nav('/');
    } catch (e) {
      setErr(e.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Login to InterviAI</h1>

        {err && <div className="mb-4 text-sm text-red-600">{err}</div>}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input className="w-full border rounded-lg px-4 py-2" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input className="w-full border rounded-lg px-4 py-2" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
          <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 font-semibold transition">
            {loading ? 'Please wait...' : 'Login'}
          </button>
        </form>

        <button onClick={handleGoogle} className="mt-4 w-full border rounded-lg py-2 font-semibold hover:bg-gray-50 transition">
          Continue with Google
        </button>

        <p className="mt-4 text-sm text-gray-600">
          No account? <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
