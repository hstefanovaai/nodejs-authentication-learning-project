// CSRF protection using the Double Submit Cookie pattern (csrf-csrf).
//
// Why this and not `csurf`: the old `csurf` package was deprecated and
// archived in 2022 and carries a known vulnerability. `csrf-csrf` is its
// actively maintained successor.
//
// How it works:
// 1. The browser calls GET /api/auth/csrf-token. The server sets a signed
//    CSRF cookie AND returns a matching token in the response body.
// 2. For every state-changing request (POST/PUT/PATCH/DELETE) the client must
//    echo that token back in the `x-csrf-token` header.
// 3. The server recomputes the token from the cookie + secret and compares it
//    to the header. A cross-site attacker can neither read the victim's cookie
//    (same-origin policy) nor set a custom header cross-site (CORS), so the
//    forged request fails.

import { doubleCsrf } from "csrf-csrf";

import { env, isProduction } from "../config/env.js";

const { generateCsrfToken, doubleCsrfProtection, invalidCsrfTokenError } =
  doubleCsrf({
    // Secret used to sign the token. Keep it in the environment.
    getSecret: () => env.csrfSecret,

    // Binds the token to the logged-in user once a session exists. It stays an
    // empty string before login so the login/signup endpoints are still
    // protected. The token is re-issued after login (the identifier changes),
    // which the client handles transparently.
    getSessionIdentifier: (req) => {
      const session = (req as { session?: { userId?: number } }).session;
      return session?.userId ? String(session.userId) : "";
    },

    // `__Host-` prefixed cookies require Secure + no Domain, which is only
    // possible over HTTPS, so we only use the prefix in production.
    cookieName: isProduction
      ? "__Host-psifi.x-csrf-token"
      : "psifi.x-csrf-token",

    cookieOptions: {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: isProduction,
    },
  });

export { generateCsrfToken, doubleCsrfProtection, invalidCsrfTokenError };
