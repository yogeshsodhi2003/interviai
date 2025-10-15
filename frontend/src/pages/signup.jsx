// src/pages/Signup.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../features/user/userSlice";
import { validateEmail, validatePassword } from "../utils/authClient";
import { User, Mail, Lock, Eye, EyeOff, UserPlus } from "lucide-react";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!validateEmail(form.email)) e.email = "Enter a valid email";
    if (!validatePassword(form.password)) e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setServerError("");
    setSuccess("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      const resp = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/user/create`,
        form
      );
      const data = resp.data;

      if (data?.token) {
        localStorage.setItem("token", data.token);
      }

      // Dispatch user data to Redux
      dispatch(
        setUser({
          userId: data?.user?._id,
          email: data?.user?.email,
          name: data?.user?.name,
          resumeSummary: data?.user?.resumeSummary,
          stats: data?.user?.stats || {},
          recent: data?.user?.recent || [],
        })
      );

      setSuccess("Account created successfully!");
      // Small delay for feedback (optional), then navigate
      setTimeout(() => navigate("/"), 300);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to create account. Please try again.";
      setServerError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Brand / Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto h-12 w-12 grid place-items-center rounded-xl bg-indigo-500/20 ring-1 ring-white/10">
            <UserPlus className="h-6 w-6 text-indigo-300" />
          </div>
          <h1 className="mt-3 text-2xl font-semibold text-white">Create account</h1>
          <p className="text-sm text-slate-300">Join and start interview practice in minutes.</p>
        </div>

        {/* Form Card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(900px_400px_at_100%_-10%,rgba(67,56,202,0.5),transparent),radial-gradient(700px_300px_at_0%_110%,rgba(14,165,233,0.4),transparent)]" />
          <div className="relative p-6 sm:p-8">
            {serverError ? (
              <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 text-red-200 px-3 py-2 text-sm">
                {serverError}
              </div>
            ) : null}
            {success ? (
              <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 px-3 py-2 text-sm">
                {success}
              </div>
            ) : null}

            <form onSubmit={onSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm mb-1 text-slate-200">
                  Name
                </label>
                <div className="relative">
                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    className={`w-full rounded-lg bg-black/20 border px-3 py-2 pl-10 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
                      errors.name ? "border-red-500/50" : "border-white/10"
                    }`}
                    placeholder="Jane Doe"
                    autoComplete="name"
                  />
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                </div>
                {errors.name ? (
                  <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                ) : (
                  <p className="text-slate-400 text-xs mt-1">Use the full display name.</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm mb-1 text-slate-2 00">
                  Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    className={`w-full rounded-lg bg-black/20 border px-3 py-2 pl-10 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
                      errors.email ? "border-red-500/50" : "border-white/10"
                    }`}
                    placeholder="jane@example.com"
                    autoComplete="email"
                  />
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                </div>
                {errors.email ? (
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                ) : (
                  <p className="text-slate-400 text-xs mt-1">Use a valid, accessible email.</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm mb-1 text-slate-200">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={onChange}
                    className={`w-full rounded-lg bg-black/20 border px-3 py-2 pl-10 pr-10 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
                      errors.password ? "border-red-500/50" : "border-white/10"
                    }`}
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2.5 top-2.5 p-1 rounded-md text-slate-400 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-white/30"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password ? (
                  <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                ) : (
                  <p className="text-slate-400 text-xs mt-1">At least 6 characters.</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-500 px-4 py-2.5 text-white shadow hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
                    Creating…
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Sign up
                  </>
                )}
              </button>

              {/* Link to sign in */}
              <div className="text-sm text-slate-300 text-center">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="text-sky-300 hover:text-sky-200 focus:outline-none focus:ring-2 focus:ring-white/30 rounded px-1"
                >
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-400 mt-4">
          By creating an account, acceptance of the Terms applies.
        </p>
      </div>
    </div>
  );
}
