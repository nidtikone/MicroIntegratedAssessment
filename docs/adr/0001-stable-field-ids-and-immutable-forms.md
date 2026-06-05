# 1. Stable field IDs and forms immutable after first response

Date: 2026-06-04

## Status

Accepted

## Context

Responses store key-value Answers that must point back to the Form's Fields.
The pointer ("key") could be the field label, the field's position/index, or a
stable generated id. Labels change and collide; positions change on reorder or
removal. Either makes the Response Viewer's dynamic columns and the Analytics
aggregation silently wrong after a form is edited.

Separately, allowing a Form's schema to change *after* Responses exist creates a
versioning problem: old Responses reference removed fields or miss newly added
ones. Full schema versioning is real scope that this assignment does not reward.

## Decision

1. Every Field gets a **stable, generated `id`** at creation time. Answers are
   keyed by this `id`, never by label or position. The label is stored too, but
   only for display.
2. A Form becomes **immutable once it has at least one Response.** The Builder
   can freely create and save a form, but editing is blocked after the first
   submission. To change a live form, the admin duplicates it into a new Form.

## Consequences

- Response Viewer columns and Analytics are provably stable: the key never moves.
- We avoid schema versioning entirely.
- Cost: a typo on a live form cannot be fixed in place; the admin must duplicate.
- "Duplicate form" is therefore an expected (if not strictly required) feature.
