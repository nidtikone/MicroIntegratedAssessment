# 2. No authentication; "admin" is a surface, not a secured actor

Date: 2026-06-05

## Status

Accepted

## Context

The assignment describes an "Admin Side" (Form Builder, Response Viewer,
Analytics Dashboard) and a public Form Renderer, but never mentions login,
users, roles, or authorization. The app is deployed to public URLs, so the
admin surface is reachable by anyone who finds it.

Adding real authentication (accounts, JWT/sessions, ownership) is meaningful
scope that the spec neither asks for nor rewards, and it would pull focus from
the evaluated features: dynamic schemas, analytics, and UI quality.

## Decision

Ship **no authentication.** Treat "admin" as a set of *surfaces* under an
`/admin/*` route namespace, not a secured *actor*. The public Renderer lives at
`/f/:publicId`. Form privacy rests only on the unguessable `publicId`
(see ADR 0001), not on access control.

## Consequences

- Effort stays on the features under evaluation.
- The deployed admin panel is editable by anyone who visits it; acceptable for
  an assignment, called out explicitly in the README.
- If auth is ever needed, it is additive (a middleware + login surface) and does
  not change the data model.
- An optional env-var passcode gate on `/admin` was considered and rejected as
  security theatre that adds friction without real protection.
