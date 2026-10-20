import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Status = "verifying" | "success" | "error";

export default function VerifyEmail() {
  const { verifyEmail } = useAuth();

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<Status>(token ? "verifying" : "error");
  const [error, setError] = useState(
    token ? "" : "The verification link is missing its token.",
  );

  // The verification token is single use. StrictMode runs effects twice in
  // development, so guard the request to avoid spending the token on the
  // second run and reporting a false failure.
  const requested = useRef(false);

  useEffect(() => {
    if (!token || requested.current) return;
    requested.current = true;

    verifyEmail(token)
      .then(() => setStatus("success"))
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : "Email verification failed.",
        );
        setStatus("error");
      });
  }, [token, verifyEmail]);

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          Verify email
        </h1>

        {status === "verifying" && (
          <p className="mt-6 text-sm text-slate-600" role="status">
            Verifying your email address...
          </p>
        )}

        {status === "success" && (
          <div className="mt-6 space-y-4">
            <div className="text-sm text-green-700" role="status">
              Your email address has been verified.
            </div>
            <Link
              to="/login"
              className="block w-full text-center bg-slate-900 text-white py-2 px-4 rounded-md hover:bg-slate-800 transition-colors font-medium"
            >
              Continue to login
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="mt-6 space-y-4">
            <div className="text-sm text-red-600" role="alert">
              {error}
            </div>
            <p className="auth-footer">
              The link may have expired or already been used.{" "}
              <Link to="/resend-verification">Request a new link</Link>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
