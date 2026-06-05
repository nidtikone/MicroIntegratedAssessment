# FormForge — Dynamic Form Builder & Analytics

A full-stack application for building dynamic forms, collecting responses through
shareable public links, and viewing live analytics. Forms have arbitrary,
admin-defined schemas; the renderer, validation, response viewer, and analytics
all adapt to whatever fields a form declares.

**Stack:** React + TypeScript (Vite) · Express (JavaScript) · MongoDB (Mongoose) · Redux Toolkit / RTK Query · Tailwind + Radix + Framer Motion · Recharts.

## Live links

| | URL |
|---|---|
| **Frontend** (Vercel) | https://micro-integrated-assessment.vercel.app/ |
| **Backend API** (Render) | https://micro-assessment-api.onrender.com |
| Health check | https://micro-assessment-api.onrender.com/api/health |

> The backend runs on Render's free tier and spins down when idle — the **first
> request after a period of inactivity can take ~50s** to cold-start. Subsequent
> requests are fast.

## Architecture

Monorepo with two independently deployable apps:

```
/
├── server/                 Express API (JavaScript)
│   └── src/
│       ├── routes/         HTTP routing only — no business logic
│       ├── controllers/    Request orchestration
│       ├── models/         Mongoose schemas (Form, Response)
│       ├── utils/          Validation, normalization, analytics (pure functions)
│       ├── middleware/     Central error handler + 404
│       ├── config/         DB connection
│       └── seed/           Idempotent seed script
├── client/                 React + TypeScript (Vite)
│   └── src/
│       ├── app/            Redux store + cache persistence
│       ├── features/       Feature-based folders:
│       │   ├── api/          RTK Query API slice (all endpoints)
│       │   ├── forms/        Forms list + detail (tabbed)
│       │   ├── builder/      Form Builder
│       │   ├── renderer/     Public form renderer
│       │   ├── responses/    Response viewer (table)
│       │   └── analytics/    Analytics dashboard (Recharts)
│       ├── components/     Reusable UI (Select, Checkbox, Dialog, state views)
│       ├── hooks/          useDebounce
│       └── utils/          validation, error parsing, time formatting
├── CONTEXT.md              Ubiquitous language / glossary
└── docs/adr/               Architecture Decision Records
```

The backend keeps **no business logic in route files** — routes wire HTTP verbs to
controllers; controllers orchestrate; pure `utils` do validation and analytics.

## Data model

- **Form** — `publicId` (nanoid shareable id, the only external identifier),
  `title`, `description`, and an ordered list of **Fields**. Each Field has a
  **stable, server-generated `id`**, a `type`, `label`, `required` flag, and
  type-specific config (`options` for select/multiselect, `min`/`max` for number,
  `format: "email"` for text).
- **Response** — a submission against one Form: a flexible **key-value `answers`
  map keyed by field `id`** (string, number, or string[] depending on type) plus
  a `submittedAt` timestamp.

**Field types:** `text` (optionally email-validated), `number` (optional min/max),
`select` (single choice), `multiselect` (multiple choices).

## Data flow

1. **Build** — the admin composes a schema in the Builder. On save it's validated
   (client mirror + authoritative server check) and `POST`ed; the server assigns
   stable field ids and a `publicId`, returning the saved schema.
2. **Share** — the form is reachable at `/f/:publicId`. The renderer fetches the
   schema and renders each field dynamically.
3. **Submit** — answers are validated on the client for UX and **re-validated on
   the server as the source of truth**; a failure returns `422` with per-field
   errors keyed by field id. Valid submissions are stored as a Response.
4. **View** — the Response Viewer renders a table whose columns are derived from
   the schema (keyed by field id), so it adapts to any form.
5. **Analyze** — analytics are computed **on demand** from the schema + responses:
   total submissions, full option distribution per select/multiselect field, and
   average/min/max per number field.

## Key features

- **Dynamic schemas** end-to-end — builder, renderer, viewer, and analytics all
  driven by the form's declared fields; nothing is hardcoded.
- **Form Builder** — add/remove fields, four field types, per-type config, live
  client validation, shareable link on save.
- **Public Renderer** — dynamic field rendering, type-based validation, server
  error surfacing per field.
- **Response Viewer** — dynamic columns, multiselect chips, empty-state handling,
  sticky header, horizontal scroll for wide forms.
- **Analytics dashboard** — KPI card, pie/bar distributions, numeric stat cards.
- **Server-authoritative validation** — required, number range, email,
  select/multiselect option membership, and save-time schema integrity.
- **Performance** — RTK Query caching persisted to localStorage, code-splitting
  (Recharts lazy-loaded), memoized field editors, debounced search.
- **Polish** — responsive layout, micro-interactions, loading/error/empty states.

## API reference

All responses use a consistent envelope: `{ success: true, data }` on success,
`{ success: false, error: { message, code, fields? } }` on failure. Forms are
addressed by `publicId`; the Mongo `_id` is never exposed.

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/health` | Liveness + DB connectivity |
| `POST` | `/api/forms` | Create a form |
| `GET` | `/api/forms` | List forms (summaries) |
| `GET` | `/api/forms/:publicId` | Get one form's schema |
| `DELETE` | `/api/forms/:publicId` | Delete a form (cascades responses) |
| `POST` | `/api/forms/:publicId/responses` | Submit a response (validated) |
| `GET` | `/api/forms/:publicId/responses` | List responses |
| `GET` | `/api/forms/:publicId/analytics` | Compute analytics |

Validation failures return `422` with `error.code = "VALIDATION"` and
`error.fields` mapping field ids (or `fields.<index>.<prop>` for schema errors)
to messages.

## Running locally

**Prerequisites:** Node 18+ and a MongoDB connection string (e.g. MongoDB Atlas).

### Backend

```bash
cd server
cp .env.example .env        # then set MONGO_URI
npm install
npm run seed                # optional: 4 sample forms + ~39 responses
npm run dev                 # http://localhost:5000
```

### Frontend

```bash
cd client
npm install
npm run dev                 # http://localhost:5173
```

`client/.env` points the dev app at `http://localhost:5000/api`;
`client/.env.production` points production builds at the Render API.

## Design decisions

Notable trade-offs are recorded as ADRs in [`docs/adr/`](docs/adr/):

1. **Stable field ids + forms immutable after first response** — answers are keyed
   by a stable field id; forms freeze once they have responses, avoiding schema
   versioning.
2. **No authentication** — "admin" is a surface, not a secured actor; auth is
   intentionally out of scope for this assignment.
3. **Duplicated validation across the JS/TS boundary** — the spec pins the backend
   to JS and the frontend to TS, so validation is mirrored, with the **server
   authoritative**.

The project's ubiquitous language is documented in [`CONTEXT.md`](CONTEXT.md).
