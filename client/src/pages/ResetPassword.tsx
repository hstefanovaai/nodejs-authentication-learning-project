import { useState, type SyntheticEvent } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Link,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
// import { resetPassword } from "../api/auth";

export default function ForgotPassword() {
  const { resetPassword } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    if (token === null || email === null) return;

    setSubmitting(true);

    try {
      await resetPassword(token, email, password, confirmPassword);

      const destination = location.state?.from?.pathname || "/products";

      navigate(destination, { replace: true });
    } catch (err) {
      console.log("err");
      console.log("Failed to update the password:", err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          Reset password
        </h1>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700"
            >
              Password {password}
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={100}
              required
              id="password"
              type="password"
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700"
            >
              Confirm Password {confirmPassword}
            </label>
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              maxLength={100}
              required
              id="confirm-password"
              type="password"
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
            />
          </div>

          {/* <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={100}
              required
              id="email"
              type="email"
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
              placeholder="you@example.com"
            />
          </div> */}

          <button
            className="w-full bg-slate-900 text-white py-2 px-4 rounded-md hover:bg-slate-800 transition-colors font-medium"
            type="submit"
            disabled={submitting}
          >
            Update password
          </button>
        </form>
      </div>
    </main>
  );
}
