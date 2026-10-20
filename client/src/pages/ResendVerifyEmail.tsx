import { useState, type SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ResendVerifyEmail() {
  const { resendVerificationEmail } = useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await resendVerificationEmail(email);

      // The same message is shown whether or not the account exists, so this
      // page does not reveal which emails are registered.
      setSuccess(
        "If an unverified account exists for this email, a new verification link has been sent.",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not resend the verification email.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          Resend verification email
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Enter your email and we will send you a new verification link.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="text-sm text-red-600" role="alert">
              {error}
            </div>
          )}
          {success && (
            <div className="text-sm text-green-700" role="status">
              {success}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={255}
              required
              id="email"
              type="email"
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
              placeholder="you@example.com"
            />
          </div>

          <button
            className="w-full bg-slate-900 text-white py-2 px-4 rounded-md hover:bg-slate-800 transition-colors font-medium"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Sending..." : "Send verification link"}
          </button>

          <p className="auth-footer">
            <Link to="/login">Back to login</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
