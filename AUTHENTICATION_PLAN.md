# Building an Authentication System — Step-by-Step Plan

This is a learning roadmap, not a tutorial with code. Each phase tells you
**what you are building**, **what you need to understand first**, **the steps in
order**, **how to know you're done**, and **the mistakes people make here**.

Work through the phases in order. Do not skip ahead — phase 7 assumes phase 5
exists. Expect roughly one evening per phase, more for 5 and 11.

**Rule for yourself while doing this:** after every phase, prove it works with
a real HTTP request (Postman, Insomnia, Thunder Client, or `curl`) *before*
touching React. Debugging a backend through a frontend is miserable.

---

## Table of contents

| # | Phase | Delivers |
| --- | --- | --- |
| 0 | [Mental model](#phase-0--mental-model) | Understanding, no code |
| 1 | [Backend foundations](#phase-1--backend-foundations) | Error handling, validation, layering |
| 2 | [Database and the user model](#phase-2--database-and-the-user-model) | A `users` table you can query |
| 3 | [Password hashing](#phase-3--password-hashing) | Hash + verify helpers |
| 4 | [Registration](#phase-4--registration) | `POST /api/auth/register` |
| 5 | [Login and token issuance](#phase-5--login-and-token-issuance) | `POST /api/auth/login` |
| 6 | [Protected routes](#phase-6--protected-routes) | `requireAuth` middleware |
| 7 | [Refresh and logout](#phase-7--refresh-and-logout) | Staying logged in, logging out |
| 8 | [User profiles](#phase-8--user-profiles) | Read/update own profile |
| 9 | [Password reset](#phase-9--password-reset) | Forgot-password flow |
| 10 | [Authorization](#phase-10--authorization) | Roles and ownership rules |
| 11 | [React integration](#phase-11--react-integration) | Auth in the UI |
| 12 | [Hardening](#phase-12--hardening) | Rate limits, CSRF, headers |
| 13 | [Tests](#phase-13--tests) | Confidence |

---

## Phase 0 — Mental model

No code. Thirty minutes of reading that will save you days.

### The one question authentication answers

HTTP is **stateless**. Every request arrives with no memory of the one before
it. So when request #2 arrives, the server has no built-in way to know it came
from the same person as request #1.

Authentication is just: *request #1 proves who you are, and the server hands
back a token; every later request carries that token.* Everything else —
hashing, JWTs, cookies, refresh rotation — is detail about **how the token is
made, stored, and revoked**.

### Authentication vs authorization

- **Authentication** = *who are you?* (login)
- **Authorization** = *are you allowed to do this?* (permissions)

They are different layers and you will build them in different phases (4–7 vs
10). Keeping them separate in your head keeps your middleware clean.

### Two ways to carry the token

| | **Stateful sessions** | **Stateless JWT** |
| --- | --- | --- |
| What the client holds | A meaningless random ID | A signed JSON payload |
| Where the truth lives | Server (DB or Redis) | Inside the token itself |
| Revoking a login | Delete the row — instant | Hard; token is valid until it expires |
| Scaling | Needs a shared session store | No lookup needed |
| Complexity | Lower | Higher |

### Where to store the token in the browser

This is the decision beginners get wrong most often.

- **`localStorage`** — readable by *any* JavaScript on your page. One XSS bug,
  one compromised npm package, and every user's token is exfiltrated. Avoid.
- **`httpOnly` cookie** — JavaScript cannot read it at all; the browser attaches
  it automatically. Immune to token theft via XSS. Costs you: you must think
  about CSRF (phase 12).

**Recommendation for this project:** `httpOnly` cookies carrying JWTs, with a
database-backed refresh token. You get JWT's cheap verification on every
request *and* the ability to revoke a session — the design most real
applications land on. The plan below assumes this.

### The design you are building toward

```
┌────────────┐                                         ┌──────────────┐
│  Browser   │                                         │   Express    │
└──────┬─────┘                                         └──────┬───────┘
       │  POST /api/auth/login  {email, password}             │
       ├─────────────────────────────────────────────────────>│
       │                                                      │ verify hash
       │                                                      │ store refresh
       │  Set-Cookie: accessToken  (httpOnly, 15 min)         │ token row
       │  Set-Cookie: refreshToken (httpOnly, 7 days)         │
       │<─────────────────────────────────────────────────────┤
       │                                                      │
       │  GET /api/users/me   (cookies sent automatically)    │
       ├─────────────────────────────────────────────────────>│
       │                                                      │ verify JWT
       │  200 { user }                                        │ signature only
       │<─────────────────────────────────────────────────────┤
       │                                                      │
       │  ...15 minutes later, access token expired...        │
       │  GET /api/users/me                        401        │
       │<─────────────────────────────────────────────────────┤
       │  POST /api/auth/refresh                              │
       ├─────────────────────────────────────────────────────>│ look up refresh
       │  new access + new refresh cookies                    │ row, rotate it
       │<─────────────────────────────────────────────────────┤
```

**Two tokens, two jobs.** The access token is short-lived (≈15 min) and checked
on every request with nothing but a signature check — no database hit. The
refresh token is long-lived (≈7 days), stored as a row in your database, and
used only at one endpoint. Short access-token life is what limits the damage of
a stolen token; the refresh row is what lets you log someone out for real.

### Reading

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [MDN: Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
- [jwt.io](https://jwt.io) — paste a token in and look at it

**Done when:** you can explain, out loud, why a JWT in `localStorage` is worse
than one in an `httpOnly` cookie, and why you need two tokens instead of one.

---

## Phase 1 — Backend foundations

Build the plumbing *before* the features. Every phase after this one leans on
it, and retrofitting it later means rewriting every route.

### Concepts

**Layered architecture.** Each layer has one job and only talks to the layer
below it:

```
route       →  "POST /register goes to this controller"       (URL mapping only)
controller  →  read req, call service, send res                (HTTP lives here)
service     →  the actual business logic                       (no req/res, ever)
model/repo  →  talk to the database                            (no business rules)
```

The payoff: your service layer is plain functions taking plain arguments. You
can call `registerUser(email, password)` from a test, a CLI script, or a
GraphQL resolver without faking an Express request. If you put logic in
controllers, none of that is possible. **The rule to hold onto: `req` and `res`
never appear below the controller layer.**

**Centralised error handling.** Express has a special middleware signature with
four parameters — `(err, req, res, next)` — that only runs when something is
passed to `next()` or thrown. Define one of these at the very bottom of your
middleware stack and every route can stop writing its own error responses.

**Operational vs programmer errors.** "Email already taken" is *expected* — the
user should see it. `undefined is not a function` is a *bug* — the user should
see a generic 500 and you should see the stack trace in your logs. Your error
handler must tell these apart, or you will eventually leak a database error
message (sometimes containing a query, sometimes a hash) to a user. The usual
trick: a custom error class carrying a `statusCode` and an `isOperational`
flag. Anything *not* an instance of that class is a bug — log it, return a
generic message.

**Validation at the boundary.** Never trust `req.body`. TypeScript types vanish
at runtime; `req.body` is `any` and whatever the client sent. Validate with a
schema library and make the *validated* object the only thing your service
sees.

### Steps

1. Install a schema validator: `npm i zod` in `server/`. (Zod gives you runtime
   validation and infers the TypeScript type from the same schema — one source
   of truth.)
2. Write `src/utils/AppError.ts`: an `Error` subclass with `statusCode` and
   `isOperational`. Add small factory helpers for the cases you'll keep
   repeating — 400, 401, 403, 404, 409.
3. Write `src/middleware/error.middleware.ts`:
   - A **not-found handler** for unmatched routes → 404.
   - An **error handler** (the four-parameter one). Operational errors →
     their status and message. Everything else → log the full error, respond
     `500` with a generic message. In development you may include the stack;
     in production never.
4. Decide how async errors reach that handler. Express 5 — which this project
   uses — forwards rejected promises from async handlers automatically. Express
   4 does not, which is why most tutorials wrap handlers in a `catchAsync`
   helper. Know this, because you will read a lot of Express 4 tutorials.
5. Write `src/middleware/validate.middleware.ts`: a function that takes a Zod
   schema, parses `req.body` (and optionally `params`/`query`) against it,
   replaces the raw value with the parsed result, and throws a 400 with
   field-level details when parsing fails.
6. Wire the two error middlewares into `createApp()` — **after** all routes.
   Order is not stylistic here; Express runs middleware top to bottom and an
   error handler registered before your routes never sees their errors.
7. Add request logging: `npm i morgan` and `npm i -D @types/morgan`, used in
   development only.

### Done when

- `GET /api/does-not-exist` returns a clean JSON 404, not Express's HTML page.
- A route that deliberately throws returns JSON 500 with no stack trace in the
  body, while the stack appears in your terminal.
- A route with a validation schema rejects a bad body with 400 and a list of
  which fields were wrong.

### Pitfalls

- Registering the error handler before the routes. It will silently never run.
- Omitting the fourth parameter. `(err, req, res)` is just a normal middleware
  to Express, and it will never be called as an error handler.
- Returning raw validation-library errors to the client. Map them to a shape
  your frontend can render next to form fields.

---

## Phase 2 — Database and the user model

### Choosing

**Recommended: PostgreSQL + Prisma.** Relational modelling is the skill that
transfers; Prisma's generated client gives you real TypeScript types for every
query, which is exactly the feedback loop you want coming from frontend work.
Its migration system also teaches you schema versioning properly.

Alternatives, if you have a reason: **MongoDB + Mongoose** (easier start,
weaker typing, and you will hand-roll things Postgres gives you); **SQLite +
Prisma** (zero setup — a single file, same Prisma API, and you can switch the
provider to Postgres later; a legitimate choice if installing a database server
is slowing you down).

Getting Postgres running locally: Docker (`postgres:17` image) is the least
invasive, or a hosted free tier (Neon, Supabase) if Docker is not an option.

### Steps

1. Get a database running and confirm you can connect with a GUI (TablePlus,
   DBeaver, pgAdmin) before involving Node at all.
2. `npm i -D prisma`, `npm i @prisma/client`, then `npx prisma init`.
3. Put the connection string in `.env` as `DATABASE_URL`, add it to
   `.env.example` with a dummy value, and add it to `src/config/env.ts`.
   Confirm `.env` is gitignored. **A real connection string in git history is
   very hard to remove.**
4. Model `User` in `schema.prisma`. Start with: `id` (prefer UUID or CUID over
   auto-increment — sequential IDs let anyone count your users and guess
   neighbours), `email` (unique), `passwordHash`, `name`, `role`
   (enum, default `USER`), `createdAt`, `updatedAt`.
5. Decide now, write it down: **store emails lowercased and trimmed.** Pick
   normalise-on-write, and apply it in one place so it cannot drift.
6. Run `npx prisma migrate dev --name init`. Open the generated SQL in
   `prisma/migrations/` and read it. This is the step most people skip and it
   is where the learning is.
7. Create a single Prisma client instance in `src/config/db.ts` and import it
   everywhere. Do not instantiate per request — you will exhaust the connection
   pool.
8. Learn `npx prisma studio` — a browser UI over your tables. You will use it
   constantly to check whether a user really got created.

### Done when

`npx prisma studio` shows an empty `User` table with the columns you expect,
and your server starts without connection errors.

### Pitfalls

- Naming the field `password`. Name it `passwordHash` — it documents the
  invariant and makes a plaintext bug obvious on sight.
- Forgetting the unique constraint on `email`. Application-level "is this email
  taken?" checks race under concurrent requests; the database constraint is the
  only real guarantee.
- Editing a migration that has already been applied. Create a new one.

---

## Phase 3 — Password hashing

Short phase, highest stakes. Nothing else in this document matters if you get
this wrong.

### Concepts

**You never store passwords.** You store a one-way hash. At login you hash the
submitted password the same way and compare. If your database leaks, the
attacker has hashes, not passwords.

**Not every hash works.** SHA-256 and MD5 are *fast*, which is their purpose
and their disqualification — modern hardware computes billions per second, so
an attacker brute-forces a leaked table quickly. Password hashing needs
algorithms deliberately made **slow and memory-hungry**: Argon2, bcrypt,
scrypt.

**Salting** means mixing a unique random value into each hash, so two users
with the same password get different hashes and precomputed rainbow tables are
useless. Both libraries below salt automatically and embed the salt in the
output string — you do not manage salts yourself, and you should not try.

**Choice:** `argon2` (Argon2id — current best practice, winner of the Password
Hashing Competition) or `bcrypt` (older, extremely well-proven, everywhere).
Either is defensible. Argon2 if you want current best practice; bcrypt if you
want the version every tutorial and Stack Overflow answer matches. If you pick
bcrypt, use a cost factor of **12 or higher**, and know that it silently
truncates input at 72 bytes.

### Steps

1. Install your choice (`npm i argon2`, or `npm i bcrypt` plus
   `npm i -D @types/bcrypt`).
2. Write `src/utils/password.ts` with exactly two exported functions: hash a
   plaintext password, and verify a plaintext against a stored hash. Nothing
   else in the codebase should import the hashing library directly — then
   changing algorithms later is a one-file change.
3. Both functions are async and genuinely slow (tens to hundreds of ms by
   design). Always `await` them.
4. Write a throwaway script that hashes `"hunter2"` twice and prints both
   results. **Confirm the two hashes differ** — that is salting, visible. Then
   confirm verify returns true for both. Delete the script.
5. Define your password policy as a Zod schema now, in one place: minimum
   length (NIST recommends **at least 8**, and length matters far more than
   character-class rules), a maximum (72 for bcrypt; set a limit like 128
   regardless so nobody submits a 10 MB string and ties up your CPU).

### Done when

You can hash and verify in isolation, and you have seen two different hashes
for the same input with your own eyes.

### Pitfalls

- Using `crypto.createHash('sha256')`. Wrong tool. This is the single most
  common fatal mistake in homemade auth.
- Comparing hashes with `===` instead of the library's verify function.
- Forgetting `await` — you will store a `Promise` object as the hash, and the
  bug surfaces at login, not registration.

---

## Phase 4 — Registration

### Endpoint

```
POST /api/auth/register
body: { email, password, name }
→ 201 { user: { id, email, name, role } }
```

### Steps

1. Create `src/routes/auth.routes.ts` and mount it at `/api/auth` in `app.ts`.
2. Write the Zod schema: valid email, password meeting your phase-3 policy,
   name with sane length bounds. Attach your validation middleware.
3. Write `src/services/auth.service.ts` with a register function. In order:
   normalise the email → check whether it exists → hash the password → insert →
   return the user **without** `passwordHash`.
4. **Stripping `passwordHash` is not optional and not cosmetic.** Decide one
   mechanism and apply it everywhere: a `toPublicUser()` mapper in
   `src/utils/`, or Prisma's `select`/`omit` on every user query. The mapper is
   harder to forget. If you ever `res.json(user)` with the raw database row,
   you have published every user's hash to anyone who opens DevTools.
5. Controller: call the service, respond 201. No logic.
6. Think about the duplicate-email response. Returning "email already
   registered" is **user enumeration** — an attacker can discover who has an
   account. The strict fix is to always return 201 and send an email that
   differs depending on whether the account existed. For a learning project,
   returning 409 is acceptable; write a `TODO` comment so you know it is a
   deliberate trade-off and not an oversight.
7. Do **not** log the user in here. Registration creates an account; login
   creates a session. Keeping them separate keeps both simple, and you need a
   working login endpoint anyway. (Auto-login after registration is a fine
   feature to add in phase 11 — by calling the login path, not duplicating it.)

### Done when

Two registrations with the same email behave correctly, Prisma Studio shows a
row whose `passwordHash` looks like `$argon2id$...` or `$2b$12$...`, and the
HTTP response contains no hash anywhere.

### Pitfalls

- Trusting a `role` field from the request body. A user who sends
  `{"role": "ADMIN"}` must not become an admin. Only ever accept the fields in
  your schema, and never put `role` in a public registration schema.
- Doing the existence check and the insert as two unguarded steps. Keep the
  unique constraint as the real guard and handle Prisma's duplicate-key error.

---

## Phase 5 — Login and token issuance

The core phase. Take your time.

### Endpoint

```
POST /api/auth/login
body: { email, password }
→ 200 { user }  + Set-Cookie: accessToken, refreshToken
```

### Concepts

**A JWT has three dot-separated parts:** header, payload, signature. The
payload is **base64-encoded, not encrypted** — anyone holding the token can
read it. Paste one into jwt.io and see. So: never put anything secret in a JWT
payload, and never put anything that goes stale fast (a user's name, their
current role) in one, because you cannot update a token you already issued.

What the signature guarantees is *integrity*: it was issued by someone holding
your secret, and nobody has altered the payload since.

**Keep the payload tiny.** A user ID, and a role only if you accept that role
changes take effect at the next refresh rather than instantly. Everything else:
look it up.

**Cookie attributes** — each one blocks a specific attack:

| Attribute | Setting | What it does |
| --- | --- | --- |
| `httpOnly` | `true` | JavaScript cannot read it. Defeats token theft via XSS. |
| `secure` | `true` in production | HTTPS only. Must be `false` on `http://localhost`. |
| `sameSite` | `lax` or `strict` | Browser won't send it on cross-site requests. First line against CSRF. |
| `maxAge` | match token expiry | Browser discards it on schedule. |
| `path` | `/` for access; `/api/auth` for refresh | Narrows where the refresh token is ever transmitted. |

`sameSite` only works if the frontend and API are same-site. The Vite proxy
already arranges this for development; in production, deploy the API on a
subdomain of the frontend's domain rather than a wholly different domain, or
you will be forced into `sameSite: 'none'` and lose the protection.

### Steps

1. `npm i jsonwebtoken cookie-parser` and
   `npm i -D @types/jsonwebtoken @types/cookie-parser`. Register
   `cookieParser()` in `app.ts` so `req.cookies` is populated.
2. Generate two strong secrets (`openssl rand -base64 32`, or
   `require('crypto').randomBytes(32).toString('base64')`). Add
   `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` to `.env`, `.env.example`
   (dummy values), and `src/config/env.ts`. **Separate secrets for the two
   token types** — otherwise a stolen access token can be replayed at the
   refresh endpoint.
3. Add the lifetimes as config too: access ≈ `15m`, refresh ≈ `7d`.
4. Write `src/utils/token.ts`: sign an access token, sign a refresh token,
   verify each. Give these precise TypeScript return types for the decoded
   payload — `jsonwebtoken` returns a loose type and you want the error at
   compile time if you misspell a claim.
5. Write `src/utils/cookies.ts`: one function that sets both auth cookies on a
   response, one that clears them. Centralising this means the attributes
   cannot drift between login, refresh, and logout — a classic source of
   "logout doesn't work" bugs.
6. Add a `RefreshToken` model to Prisma: `id`, `userId` (relation), a token
   identifier, `expiresAt`, `createdAt`, `revokedAt` (nullable). Optionally
   `userAgent` and `ip` so you can build a "your active sessions" screen later.
   Migrate.
   - **Store a hash of the refresh token, not the token.** Treat your token
     table the way you treat your password column: if the database leaks, the
     rows must not be usable as credentials.
7. Login service, in order: normalise email → find user → verify password →
   issue both tokens → persist the hashed refresh token → return the public
   user.
8. **Both failure cases — unknown email and wrong password — must return the
   identical 401 with an identical message.** Different responses tell an
   attacker which emails are registered.
9. Controller: call the service, set the cookies, return the user.

### Done when

Logging in sets two cookies (check the Network tab → Response Headers →
`Set-Cookie`, and the Application → Cookies panel), the access token's payload
decodes on jwt.io to your user's ID, and wrong-password / unknown-email produce
byte-identical responses.

### Pitfalls

- `secure: true` on `http://localhost`. The browser silently drops the cookie
  and you get a login that "succeeds" but sets nothing. If cookies are
  mysteriously absent, check this first.
- A hardcoded fallback secret like `process.env.SECRET || 'devsecret'`. It will
  reach production. Let the app crash at boot instead — that is what the
  `required()` helper in `config/env.ts` is for.
- Putting the password hash, or anything else private, in the JWT payload.

---

## Phase 6 — Protected routes

### Steps

1. Write `src/middleware/auth.middleware.ts` exporting `requireAuth`. It should:
   read the access token from `req.cookies` → 401 if missing → verify the
   signature → 401 if invalid or expired → attach the user ID (and role) to the
   request → call `next()`.
2. Teach TypeScript about the new property. Express's `Request` type has no
   `user`. Use declaration merging in `src/types/express.d.ts` to extend
   `Express.Request`, and make sure `tsconfig.json`'s `include` covers it. Do
   not cast to `any` at every use site — this is exactly the kind of thing
   TypeScript is for, and getting it right once is a genuinely useful skill.
3. Attach only the ID and role, not the whole user record. Fetching the user
   from the database on *every single request* defeats the point of stateless
   tokens. Let controllers that need full user data fetch it themselves.
4. Add a temporary `GET /api/users/me` behind `requireAuth` that echoes
   `req.user`, just to prove the middleware works. Phase 8 makes it real.
5. Distinguish your 401 reasons internally — missing token, malformed token,
   expired token. The client needs to tell "expired, try refreshing" from
   "not logged in at all" (phase 11). A distinct error code in the response
   body, with the same 401 status, is the usual approach.
6. Optionally write `optionalAuth`, which attaches the user when a valid token
   is present but does not reject otherwise — useful for endpoints that show
   more to logged-in users.

### Done when

The protected route returns 401 with no cookie and 200 with one. Hand-editing a
character of the cookie value in DevTools produces a 401 — that is the
signature doing its job.

### Pitfalls

- Reading the token from the `Authorization` header when you chose cookies. Pick
  one transport and be consistent; supporting both doubles your attack surface
  for no benefit here.
- Treating an expired token as a 500. Expiry is normal and expected; it is a
  401.

---

## Phase 7 — Refresh and logout

### Endpoints

```
POST /api/auth/refresh     → new access + refresh cookies
POST /api/auth/logout      → clears cookies, revokes this session
POST /api/auth/logout-all  → revokes every session for the user
```

### Concepts

**Refresh token rotation.** Every refresh issues a *new* refresh token and
revokes the old one. Each token is single-use.

This buys you theft detection. If a token is stolen, either the attacker or the
legitimate user will use it second — and that second use presents an
already-revoked token. A reused token means "this token leaked." The standard
response is to revoke the entire token family (every session for that user) and
force a fresh login. Slightly annoying for the user; fatal for the attacker.

### Steps

1. Refresh flow: read the refresh cookie → verify its signature → hash it and
   look up the row → reject if missing, revoked, or expired → mark the old row
   revoked → issue and store a new pair → set new cookies.
2. Implement the reuse detection: an incoming token whose row is **already
   revoked** is not merely invalid. Revoke all of that user's tokens and return
   401.
3. Logout: revoke the row for the current refresh token and clear both cookies.
   **Clearing cookies alone is not logout** — the token stays valid and anyone
   who captured it can keep using it. Server-side revocation is the real
   action; clearing cookies is housekeeping.
4. When clearing cookies, pass the same `path`, `sameSite`, and `secure` values
   used when setting them. Mismatched attributes mean the browser clears
   nothing and the user stays logged in. This is why phase 5 step 5 centralised
   them.
5. Logout-all: revoke every non-revoked row for the user. Needed after a
   password change (phase 8) and a password reset (phase 9).
6. Write a cleanup routine that deletes expired rows, and run it on a schedule
   or at startup. Without it the table grows forever.

### Done when

You can refresh successfully; the old refresh token then fails; replaying that
old token kills every session; logout makes the protected route 401 and the
refresh token unusable even if you paste it back into DevTools by hand.

### Pitfalls

- Letting refresh succeed without checking the database row. Then logout cannot
  work and you have stateless tokens with extra steps.
- Not handling two refreshes racing (two browser tabs). A small grace window on
  the just-revoked token, or a short lock, avoids logging people out for no
  reason. Know the problem exists.

---

## Phase 8 — User profiles

A breather phase, and your first real CRUD on authenticated data.

### Endpoints

```
GET    /api/users/me            → current user's profile
PATCH  /api/users/me            → update name, avatar, etc.
PATCH  /api/users/me/password   → change password (requires current password)
DELETE /api/users/me            → delete account
```

### Steps

1. Extend the Prisma `User` model with profile fields you care about (bio,
   avatar URL, timezone). Migrate.
2. `GET /me` reads `req.user.id`, fetches, returns the public shape. **Never
   accept a user ID from the URL or body for "me" endpoints** — the ID comes
   from the verified token, always. `GET /api/users/:id/profile` returning
   private data based on a URL parameter is the textbook broken-access-control
   bug.
3. `PATCH /me` needs a schema of *only* the updatable fields. Email, role,
   `id`, and `passwordHash` must not be in it — mass-assignment is how
   privilege escalation happens.
4. Change password: require the current password and verify it even though the
   user is authenticated. This is what stops someone on a borrowed laptop from
   locking out the owner. Then hash the new one, update, and **revoke all other
   sessions** (phase 7's logout-all) while keeping the current one alive.
5. Changing email deserves its own flow with verification sent to the new
   address — otherwise a typo locks the user out and an attacker can reassign
   an account. Either implement it after phase 9 (same email infrastructure) or
   leave email immutable and write that decision down.
6. Account deletion: decide hard delete vs soft delete (a `deletedAt` column).
   Soft delete keeps referential integrity and is reversible; if you choose it,
   every user query must filter out deleted rows, and the unique email
   constraint needs thought if people should be able to re-register.

### Done when

A logged-in user can read and update their own profile, cannot touch anyone
else's, and a password change invalidates their other sessions but not the
current one.

---

## Phase 9 — Password reset

The flow with the most security detail. Read carefully.

### Endpoints

```
POST /api/auth/forgot-password   body: { email }       → always 200
POST /api/auth/reset-password    body: { token, newPassword }
```

### Concepts

The reset token is **a temporary credential that bypasses the password**. Treat
it with the same paranoia as the password itself.

Rules, each for a reason:

1. **Cryptographically random**, from `crypto.randomBytes` — never `Math.random`
   (predictable), never a JWT (you cannot revoke it after use).
2. **Store only a hash** of it. A leaked database must not yield working reset
   links for every pending request.
3. **Short expiry** — 15 to 60 minutes.
4. **Single use.** Delete or mark it used the moment a reset succeeds.
5. **Always respond 200**, whether or not the email exists. Anything else turns
   the endpoint into a free account-enumeration oracle.

### Steps

1. Add a `PasswordResetToken` model: `id`, `userId`, `tokenHash`, `expiresAt`,
   `usedAt`. Migrate.
2. Pick an email transport. For development, use a catcher so you never send
   real mail: **Mailtrap**, **Ethereal** (nodemailer generates throwaway
   credentials and gives you a preview URL), or **MailHog** in Docker. Install
   `nodemailer`. Keep provider details behind `src/services/email.service.ts`
   so swapping to a production provider later touches one file.
3. Forgot-password: look up the user → **if found**, invalidate their existing
   reset tokens, generate a new one, store its hash, email the link →
   **always** return the same 200 and the same message.
4. The link points at your *frontend* (`CLIENT_ORIGIN` + `/reset-password?token=…`),
   not the API. The frontend shows the form and POSTs to the API.
5. Reset: hash the submitted token → look it up → reject if missing, used, or
   expired → validate the new password against the same policy → hash it →
   update the user → mark the token used → **revoke every refresh token for
   that user**. A reset exists because the account may be compromised; leaving
   existing sessions alive defeats the entire purpose.
6. Rate-limit forgot-password hard (phase 12), per IP *and* per email address.
   Otherwise it is a free email-bombing service pointed at your users.
7. Send a plain notification email ("your password was changed") after a
   successful reset. It is the user's only signal if it wasn't them.

### Done when

The full loop works end to end in your mail catcher; reusing a consumed token
fails; an expired token fails; a nonexistent email yields the identical 200;
and all sessions are gone after a reset.

### Pitfalls

- Putting the token in the URL and then logging full URLs. It lands in your
  access logs in plaintext. Scrub it, or accept the risk knowingly.
- Letting the reset endpoint skip the password policy. It is a second door into
  the same room and needs the same lock.

---

## Phase 10 — Authorization

Authentication asks *who are you*; authorization asks *may you do this*. You
already have the `role` field — now enforce it.

### Concepts

Two distinct checks, and you need both:

- **Role-based (RBAC):** "admins may list all users." A property of the user.
- **Ownership / resource-based:** "you may edit *your own* post." A property of
  the relationship between this user and this specific record.

Role checks alone are the classic hole: a `USER` is correctly allowed to call
`PATCH /api/posts/:id`, and without an ownership check they can edit anyone's
post by changing the ID. This is **IDOR** (insecure direct object reference),
and it is the most common serious vulnerability in real applications.

### Steps

1. Write `requireRole(...roles)` in `src/middleware/auth.middleware.ts`: a
   middleware factory returning a middleware that checks `req.user.role`. It
   always runs *after* `requireAuth`, never instead of it.
2. Get the status codes right: **401** means "I don't know who you are"
   (authenticate); **403** means "I know who you are and the answer is no."
   Returning 401 for a permission failure sends clients into pointless refresh
   loops.
3. Ownership cannot be middleware in the general case — it needs the record, so
   it needs a database read. Do it in the service layer, right after loading
   the resource: compare the owner ID to `req.user.id`, and allow admins
   through. Make it a shared helper so the check is identical everywhere
   instead of re-derived per endpoint.
4. Consider what a 403 reveals. For sensitive resources, returning **404** for
   "exists but isn't yours" hides whether the record exists at all. A judgement
   call — but make it consciously.
5. If you want to go further, read about permission-based authorization
   (`post:delete` strings rather than role names) and attribute-based access
   control. Roles stop scaling around the third or fourth role; you do not need
   this yet, but you should know where the ceiling is.
6. Add at least one admin-only endpoint (list users, paginated) to exercise the
   middleware. Create your first admin by flipping the role in Prisma Studio or
   a seed script — never via an API endpoint.

### Done when

A `USER` gets 403 on the admin endpoint, an `ADMIN` gets 200, and a user cannot
modify another user's resource by changing an ID in the URL — you have actually
tried it and seen it fail.

---

## Phase 11 — React integration

Now the part you already have instincts for. The backend work pays off here:
`httpOnly` cookies mean the React app never handles a token at all.

### Concepts

**The frontend cannot read the auth cookie — by design.** So "am I logged in?"
is answered by *asking the server*: call `GET /api/users/me` on mount. 200 means
logged in, 401 means not.

This is why you need three states, not two: `loading`, `authenticated`,
`unauthenticated`. Collapsing `loading` into `unauthenticated` is why apps
flash the login page for half a second on every refresh.

### Steps

1. Set up routing with `react-router-dom` (already installed). Routes:
   `/login`, `/register`, `/forgot-password`, `/reset-password`, `/profile`,
   `/dashboard`.
2. Write a fetch wrapper in `src/lib/api.ts`. Every call must include
   `credentials: 'include'` — **without it the browser sends no cookies and
   every request is anonymous.** This is the single most common integration
   bug. Put it in the wrapper so it cannot be forgotten at a call site.
3. Build `AuthContext` in `src/context/`: holds `user`, `status`
   (`'loading' | 'authenticated' | 'unauthenticated'`), and `login`,
   `register`, `logout` functions. On mount, call `/api/users/me` once to
   resolve the initial status.
4. Write a `<ProtectedRoute>` component: while `loading`, render a spinner;
   when `unauthenticated`, `<Navigate to="/login" replace />` — and stash the
   attempted URL so you can send them back after login; when `authenticated`,
   render the children.
   - **This is UX, not security.** Anyone can edit your JavaScript. The server's
     `requireAuth` is the real enforcement; the client-side guard just avoids
     showing a page that would fail anyway. Internalise this.
5. Handle transparent refresh in the wrapper: on a 401 with your "token
   expired" code, call `/api/auth/refresh` once, then retry the original
   request. If the refresh also fails, clear the user and redirect to login.
   - Guard against the infinite loop: never refresh in response to a 401 *from
     the refresh endpoint*, and never retry more than once.
   - Queue concurrent 401s so five parallel requests trigger one refresh, not
     five. Five simultaneous refreshes with rotation enabled will trip your own
     reuse detection and log the user out.
6. Build the forms with Tailwind. Nothing exotic — but handle the states you
   will actually hit: submitting (disable the button; double-submitting
   registration is a real bug), field-level errors from your 400 responses, and
   a general error line for 401/500.
7. Add a role-aware piece of UI (an admin link that only renders for admins) to
   see authorization from the client side. Remember step 4: hiding the link is
   cosmetic; the endpoint is what's protected.

### Done when

Refreshing the browser on `/profile` keeps you logged in without a flash of the
login page; logging out makes `/profile` redirect; and leaving the tab idle
past the access-token lifetime still works, because the next request refreshed
silently.

### Pitfalls

- Omitting `credentials: 'include'`. Everything 401s and nothing looks wrong.
- Storing the user in `localStorage` as the source of truth. It will disagree
  with the server. The server decides; cache in memory if you must.
- Forgetting that React 18+ StrictMode double-invokes effects in development.
  Your mount-time `/me` call will fire twice. That is expected, not a bug.

---

## Phase 12 — Hardening

Do this before you would ever deploy. Pick off one at a time.

1. **Rate limiting** — `express-rate-limit`. Strict on `/login`, `/register`,
   and `/forgot-password`; loose globally. Rate limiting is the only thing
   standing between your login endpoint and a credential-stuffing script. Note
   that behind a proxy you must set `app.set('trust proxy', …)` or every
   request appears to come from one IP.
2. **Security headers** — `helmet`. One line, sets a dozen sensible headers.
3. **Body size limit** — pass a `limit` to `express.json()` (e.g. `10kb`).
   Without it, someone can post a 100 MB JSON body and exhaust your memory.
4. **CSRF** — `sameSite: 'lax'` covers most of it, but add the double-submit
   cookie pattern (`csrf-csrf`) if you ever need `sameSite: 'none'`. Understand
   *why* cookie auth needs this and token-in-header auth does not: the browser
   attaches cookies automatically, including on requests a malicious site
   triggered.
5. **Account lockout** — after N failed logins for one account, require a
   cooldown. Balance against the denial-of-service it enables (an attacker can
   lock out a known user on purpose); exponential backoff is gentler than a
   hard lock.
6. **Timing attacks** — if you return early when the email is unknown, the
   response is measurably faster than a wrong-password response, and that
   difference leaks which emails exist. Run the hash verification against a
   dummy hash even when no user was found.
7. **Email verification** — require a confirmed email before granting full
   access. Same token mechanics as phase 9; it slots in naturally there.
8. **Logging** — log authentication events (login success/failure, password
   change, reset request) with user ID, IP, and timestamp. **Never log tokens,
   passwords, or reset links.**
9. **`npm audit`** and a dependency updater. Your auth code is only as safe as
   `jsonwebtoken`'s latest CVE.
10. **Production config review** — `secure: true` on cookies, `NODE_ENV` set,
    secrets from a real secret manager rather than a `.env` file on disk, HTTPS
    enforced, stack traces off.

---

## Phase 13 — Tests

Auth is the code most worth testing: it changes rarely, breaks catastrophically,
and is tedious to re-verify by hand.

1. Install **Vitest** and **supertest**. `createApp()` being separate from
   `index.ts` is what makes supertest work without binding a port — this is the
   payoff for that split.
2. Use a separate test database (a different `DATABASE_URL`, or SQLite for
   speed). Reset it between tests.
3. The cases that matter most, in rough priority order:
   - Register → login → access a protected route → logout → protected route now
     401.
   - Wrong password and unknown email return identical responses.
   - An expired access token is rejected; refresh then succeeds.
   - A reused refresh token revokes the whole family.
   - A `USER` gets 403 on an admin route.
   - A user cannot modify another user's resource (the IDOR test — the most
     valuable test in the list).
   - A used or expired reset token is rejected.
4. One end-to-end happy path through the React app with Playwright, if you want
   to go further.

---

## Dependency summary

Install these as the phases call for them, not all at once.

| Phase | Package | Purpose |
| --- | --- | --- |
| 1 | `zod` | Runtime validation of request bodies |
| 1 | `morgan` + `@types/morgan` | Request logging in development |
| 2 | `prisma` (dev), `@prisma/client` | Database access and migrations |
| 3 | `argon2` *or* `bcrypt` + `@types/bcrypt` | Password hashing |
| 5 | `jsonwebtoken` + `@types/jsonwebtoken` | Signing and verifying JWTs |
| 5 | `cookie-parser` + `@types/cookie-parser` | Reading cookies off requests |
| 9 | `nodemailer` | Sending reset emails |
| 12 | `helmet` | Security headers |
| 12 | `express-rate-limit` | Brute-force protection |
| 12 | `csrf-csrf` | CSRF tokens, if you need `sameSite: 'none'` |
| 13 | `vitest`, `supertest` + `@types/supertest` | Tests |

Frontend packages (`react-router-dom`) are already installed.

---

## If you get stuck

- **Cookie not being set** — `secure: true` on `http://localhost` is the cause
  nine times out of ten. Then check that the response actually carries a
  `Set-Cookie` header.
- **Cookie set but not sent back** — missing `credentials: 'include'` on the
  frontend, or a `path` mismatch, or a `sameSite` problem from skipping the
  proxy.
- **`req.user` is `undefined` in TypeScript** — the declaration-merging file
  isn't covered by `tsconfig.json`'s `include`.
- **"Cannot find module './foo'"** — ESM needs the `.js` extension on relative
  imports, even in TypeScript source. See the README.
- **Everything 401s after 15 minutes** — refresh isn't wired up, or the refresh
  cookie's `path` is narrower than the endpoint you're calling.

Verify each phase with real HTTP requests before moving on. The compounding
cost of a quiet bug in phase 5 found during phase 11 is what makes auth feel
hard.
