import { useState, type SyntheticEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiError } from "../api/auth";
import { useAuth } from "../context/AuthContext";

function inputClass(hasError: boolean) {
  return `mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 ${
    hasError ? "border-red-600" : "border-slate-300"
  }`;
}

export default function SignUp() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");
    setNameError("");
    setEmailError("");
    setPasswordError("");

    if (!name.trim()) {
      setNameError("Name is required.");
      return;
    }

    setSubmitting(true);

    try {
      await signup(name, email, password);

      setSuccess("Account created! Redirecting to login page ...");

      navigate("/login", {
        replace: true,
        state: { message: "Account created. Please log in." },
      });
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors?.length) {
        for (const { field, message } of err.fieldErrors) {
          if (field === "name") setNameError(message);
          else if (field === "email") setEmailError(message);
          else if (field === "password") setPasswordError(message);
          else setError(message);
        }
      } else {
        setError(
          err instanceof Error
            ? err.message
            : typeof err === "string"
              ? err
              : "An unexpected error occurred.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Sign Up</h1>
        <p className="mt-2 text-sm text-slate-600">
          Create a new account to get started.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="text-sm text-red-600" role="alert">
              {error}
            </div>
          )}
          {success && <div className="text-sm text-green-700">{success}</div>}

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700"
            >
              Name
            </label>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError("");
              }}
              maxLength={100}
              required
              id="name"
              type="text"
              className={inputClass(!!nameError)}
              placeholder="John Doe"
            />
            {nameError && (
              <p className="mt-1 text-sm text-red-600">{nameError}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
              maxLength={255}
              required
              id="email"
              type="email"
              className={inputClass(!!emailError)}
              placeholder="you@example.com"
            />
            {emailError && (
              <p className="mt-1 text-sm text-red-600">{emailError}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <input
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
              }}
              maxLength={100}
              required
              id="password"
              type="password"
              className={inputClass(!!passwordError)}
              placeholder="••••••••"
            />
            {passwordError && (
              <p className="mt-1 text-sm text-red-600">{passwordError}</p>
            )}
          </div>

          <button
            className="w-full bg-slate-900 text-white py-2 px-4 rounded-md hover:bg-slate-800 transition-colors font-medium"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Creating account..." : "Sign Up"}
          </button>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
