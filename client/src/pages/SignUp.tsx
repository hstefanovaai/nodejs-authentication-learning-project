import { useState, type SyntheticEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignUp() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password.length < 6 || password.length > 128) {
      setError("Password must be between 6 and 128 characters.");
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
      err instanceof Error ? err.message : "Signup failed.";
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

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            {error && (
              <div className="text-sm text-red" role="alert">
                {error}
              </div>
            )}
            {success && <div className="text-sm text-green">{success}</div>}

            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700"
            >
              Name 
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              required
              id="name"
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
              placeholder="John Doe"
            />
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
              onChange={(e) => setEmail(e.target.value)}
              maxLength={255}
              required
              id="email"
              type="email"
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
              placeholder="you@example.com"
            />
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
              onChange={(e) => setPassword(e.target.value)}
              maxLength={100}
              required
              id="password"
              type="password"
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
              placeholder="••••••••"
            />
          </div>

          {/* <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-slate-700"
            >
              Confirm Password
            </label>
            <input
              value={confirmedPassword}
              onChange={(e) => setConfirmedPassword(e.target.value)}
              maxLength={100}
              required
              id="confirm-password"
              type="password"
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
              placeholder="••••••••"
            />
          </div> */}

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



// import { useState, type FormEvent } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function Signup() {
//   const { signup } = useAuth();
//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   async function handleSubmit(e: FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (password.length < 12 || password.length > 128) {
//       setError("Password must be between 12 and 128 characters.");
//       return;
//     }

//     setSubmitting(true);

//     try {
//       await signup(name, email, password);

//       setSuccess("Account created! Redirecting to login...");

//       navigate("/login", {
//         replace: true,
//         state: { message: "Account created. Please log in." },
//       });
//     } catch (err) {
//       setError(
//         err instanceof Error ? err.message : "Signup failed."
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   return (
//     <main className="auth-page">
//       <form className="auth-card" onSubmit={handleSubmit}>
//         <h1>Create an account</h1>
//         <p>Sign up to get started.</p>

//         {error && <div className="error-message" role="alert">{error}</div>}
//         {success && <div className="success-message">{success}</div>}

//         <label htmlFor="name">Name</label>
//         <input
//           id="name"
//           type="text"
//           autoComplete="name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           maxLength={100}
//           required
//         />

//         <label htmlFor="signup-email">Email</label>
//         <input
//           id="signup-email"
//           type="email"
//           autoComplete="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           maxLength={254}
//           required
//         />

//         <label htmlFor="signup-password">Password</label>
//         <input
//           id="signup-password"
//           type="password"
//           autoComplete="new-password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           minLength={12}
//           maxLength={128}
//           required
//         />

//         <button type="submit" disabled={submitting}>
//           {submitting ? "Creating account..." : "Sign Up"}
//         </button>

//         <p className="auth-footer">
//           Already have an account? <Link to="/login">Log in</Link>
//         </p>
//       </form>
//     </main>
//   );
// }
