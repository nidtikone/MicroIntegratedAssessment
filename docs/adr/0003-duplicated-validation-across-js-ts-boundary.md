# 3. Validation is duplicated across the JS/TS boundary, server authoritative

Date: 2026-06-05

## Status

Accepted

## Context

The assignment pins the backend to **JavaScript** (Express) and the frontend to
**TypeScript** (React). The same response-validation rules — required fields,
number min/max, email format, select/multiselect option membership, and
save-time schema integrity — are needed on both sides: the client validates for
instant UX, the server validates as the trusted gatekeeper.

Because of the language boundary, a single shared validation module cannot be
imported by both without bending the prescribed stack (e.g. shipping a plain-JS
validator into the TS client, or moving the backend to TS). Either bend softens
a constraint the assignment set deliberately.

## Decision

Accept the duplication, deliberately. Keep **one canonical JS validation module
on the server as the source of truth**, and a **thin, mirrored TS copy on the
client** for immediate feedback. The server is authoritative: the client also
renders server-returned field errors (422 + `error.fields`, see the API
contract), so correctness never depends on the client's copy.

## Consequences

- We honour the spec's JS-backend / TS-frontend boundary as given.
- The two validators can drift; mitigated by keeping each a handful of small,
  pure functions and treating the server as the only source of truth.
- No build-time coupling or shared package between client and server.
- The trade-off is documented in the README so it reads as a conscious choice,
  not an oversight.
