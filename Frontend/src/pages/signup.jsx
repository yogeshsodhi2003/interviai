// src/pages/Signup.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { validateEmail, validatePassword } from "../utils/authClient";

export default function Signup() {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!validateEmail(form.email)) e.email = "Enter a valid email";
    if (!validatePassword(form.password))
      e.password = "Password must be at least 6 characters";
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
      const data = resp.data
      localStorage.setItem("token", data.token);
      // Dispatch user data to Redux
      dispatch(
        setUser({
          userId: data.user._id,
          email: data.user.email,
          name: data.user.name,
        })
      );
      navigate("/");
      navigate("/");
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md border rounded-lg p-6 shadow-sm">
        <h1 className="text-2xl font-semibold mb-4">Create account</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Jane Doe"
              autoComplete="name"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              className="w-full border rounded px-3 py-2"
              placeholder="jane@example.com"
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              className="w-full border rounded px-3 py-2"
              placeholder="••••••••"
              autoComplete="new-password"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {serverError && <p className="text-red-600 text-sm">{serverError}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? "Creating…" : "Sign up"}
          </button>
        </form>
        <p className="text-sm mt-4">
          Already have an account?{" "}
          <a href="/signin" className="text-blue-600">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
