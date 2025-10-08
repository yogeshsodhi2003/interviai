// src/components/Signup.tsx
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function handleSignup(e) {
    e.preventDefault();
    if (password !== confirm) return setErr('Passwords do not match');
    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      nav('/');
    } catch (e) {
      setErr(e.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create your account</h1>

        {err && <div className="mb-4 text-sm text-red-600">{err}</div>}

        <form onSubmit={handleSignup} className="space-y-4">
          <input className="w-full border rounded-lg px-4 py-2" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input className="w-full border rounded-lg px-4 py-2" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
          <input className="w-full border rounded-lg px-4 py-2" type="password" placeholder="Confirm password" value={confirm} onChange={e=>setConfirm(e.target.value)} required />
          <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 font-semibold transition">
            {loading ? 'Please wait...' : 'Create account'}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Already have an account? <Link to="/signin" className="text-blue-600 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
