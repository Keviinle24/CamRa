# CamRa

Spontaneous video chat for verified college students. Sign up with a university email, add a few interests, and get paired with another student for a live video and text chat. Press **Next** to meet someone new.

## Tech stack

| Area      | Choice                                                                   |
| --------- | ------------------------------------------------------------------------ |
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript                 |
| UI        | Bootstrap 5.3 themed with Sass, react-bootstrap, Bootstrap Icons         |
| Data      | MongoDB with Mongoose                                                    |
| Auth      | Email + password (bcrypt), email verification, signed JWT session cookie |
| Email     | SMTP (e.g. Gmail) via Nodemailer, or Resend                              |
| Realtime  | Agora RTC (video/audio) and Agora RTM 2 / Signaling (text chat)          |

## Getting started

Requirements: Node.js 20.9+ and a MongoDB database (MongoDB Atlas or a local `mongod`).

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

### Development shortcuts (`npm run dev` only)

- **No database needed.** If `MONGODB_URI` is empty, a local MongoDB starts automatically (data kept in the git-ignored `.dev-db/` folder).
- **Skip login.** Use the "Skip login (dev only)" button on `/login`, or open [`/api/dev/login`](http://localhost:3000/api/dev/login) to sign in as `demo@northeastern.edu`. Add `?user=2` (up to 5) for a second demo account, e.g. in another browser to test a two-person chat. Demo accounts can also log in with the password `password123`.

Neither works in production builds.

### Environment variables

| Variable           | Required        | Notes                                                                                                        |
| ------------------ | --------------- | ------------------------------------------------------------------------------------------------------------ |
| `MONGODB_URI`      | yes             | MongoDB connection string.                                                                                   |
| `JWT_SECRETKEY`    | yes             | Signs session cookies and call IDs. Use a long random value (`openssl rand -base64 48`).                     |
| `AGORA_APP_ID`     | for video chat  | Agora project App ID. `NEXT_PUBLIC_AGORA_APP_ID` from the previous version is still accepted.                |
| `AGORA_APP_CERT`   | for video chat  | Agora App Certificate. The Agora project must have the certificate **and Signaling (RTM)** enabled.           |
| `SMTP_HOST` `SMTP_PORT` `SMTP_USER` `SMTP_PASSWORD` | one email service in production | Send verification emails through any SMTP account, e.g. Gmail (`smtp.gmail.com`, port `465`, your address, an [app password](https://myaccount.google.com/apppasswords)). |
| `RESEND_API_KEY`   | one email service in production | Alternative to SMTP. Needs a domain verified in Resend to email anyone but yourself.            |
| `EMAIL_FROM`       | with Resend     | Sender shown in the inbox. With SMTP it defaults to `SMTP_USER`.                                             |
| `APP_URL`          | recommended     | Public site URL used in email links and social previews. Defaults to the request's origin.                   |

### Scripts

| Command             | What it does                  |
| ------------------- | ----------------------------- |
| `npm run dev`       | Development server            |
| `npm run build`     | Production build              |
| `npm start`         | Serve the production build    |
| `npm run lint`      | ESLint                        |
| `npm run typecheck` | TypeScript, no emit           |

### Troubleshooting

- **Sign-up or login fails.** Check the terminal: on startup the server prints a `⚠ CamRa configuration` list of anything missing, and in development the form shows the exact problem (e.g. `MONGODB_URI is not set`). After editing `.env.local`, restart the server.
- **No verification email arrives.** With no email service configured, `npm run dev` prints the verification link in the terminal instead. `npm start` (production mode) requires SMTP or Resend. Ask students to check their spam folder the first time.
- **Changes don't show up with `npm start`.** It serves the last `npm run build`. Use `npm run dev` while developing.

### Testing on a phone

Browsers only allow camera access on HTTPS or `localhost`, so opening `http://<your-LAN-IP>:3000` on a phone won't be able to start video. Use an HTTPS tunnel (for example `ngrok http 3000` or `cloudflared tunnel --url http://localhost:3000`) and set `APP_URL` to the tunnel URL.

## Project structure

```
app/                     Routes (App Router)
  page.tsx               Landing page
  login/, register/      Auth pages
  activate/[token]/      Email verification link target
  chat/                  The video chat app (requires login)
  terms/, privacy/       Legal pages
  api/                   JSON API (auth, rooms, account)
components/
  brand/                 Logo
  site/                  Landing navbar and footer
  landing/               Landing page sections and showcase carousel
  auth/                  Auth layout, forms, "check your inbox"
  chat/                  Lobby, interest filter, call view, chat panel, navbar
  legal/                 Terms/privacy text and modal
hooks/useVideoChat.ts    Agora + matchmaking lifecycle for the chat page
lib/                     Server and shared logic (db, sessions, rate limiting, email, matchmaking, validation)
models/                  Mongoose models (user, Room)
proxy.ts                 Route protection (Next.js 16's replacement for middleware)
styles/_tokens.scss      Brand colours, gradient, and breakpoints
public/images/           Optimised site imagery
```

Supported universities live in `lib/universities.ts`. Add a school there to allow sign-ups from its email domain (subdomains such as `g.ucla.edu` are accepted automatically).

## How matching works

1. **Start** requests the camera and microphone, then calls `POST /api/rooms`.
2. The server atomically claims the oldest waiting room, preferring one whose member shares an interest, or opens a new waiting room. It never pairs you with your own account or with a room you just skipped with **Next**.
3. The response includes a short-lived Agora token for that room. The browser joins the video channel and subscribes to its text chat.
4. While in a room, the browser sends a heartbeat every 5 seconds. Members who stop sending heartbeats (closed tab, lost connection) are removed after 30 seconds, and the remaining person goes back to waiting. Idle rooms are deleted automatically by a MongoDB TTL index.
5. If two people end up waiting in separate rooms, the heartbeat tells the newer one to move into the older room.

Agora user IDs ("call IDs") are random per session, so partners can't identify each other, and they're HMAC-signed with the user's ID so nobody can request tokens for another person's call.

## Deployment notes

- Rate limits are kept in memory per server instance. On serverless or multi-instance hosting they apply per instance; move them to a shared store (e.g. Redis) if you need global limits.
- The session cookie is named `token`, and accounts from the previous version work unchanged.
