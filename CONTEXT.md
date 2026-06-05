# Context: Dynamic Form Builder & Analytics

The ubiquitous language for this system. This is a glossary, not a spec — no implementation details.

## Glossary

### Form
A schema authored by an admin in the Form Builder. Defines an ordered set of **Fields** and carries a unique shareable identifier used to reach its public **Renderer**. A Form is the template; it holds no submitted data.

### Field
One input within a **Form**. Has a **Field Type**, a label, and a required/optional flag. Select-style fields also carry a fixed list of allowed **Options**.

### Field Type
The kind of input a **Field** accepts. Four types exist:
- **text** — free-form string.
- **number** — numeric value.
- **select** — exactly one choice from the Field's **Options** (single-choice).
- **multiselect** — zero or more choices from the Field's **Options** (multiple-choice). Distinct from select; a multiselect **Answer** is a list, a select Answer is a single value.

### Option
One allowed choice listed on a **select** or **multiselect** Field.

### Response
One completed submission of a **Form** by a public user. Holds a set of **Answers** keyed by Field, plus a submission timestamp. Belongs to exactly one Form.

### Answer
The value a **Response** supplies for one **Field**. Shape depends on Field Type: a string (text), a number, a single Option value (select), or a list of Option values (multiselect).

### Analytics
Aggregate figures computed across all **Responses** to one **Form**: total submission count, most-selected Options per select/multiselect Field, and average value per number Field. Always scoped to a single Form, computed on demand. Returns the *full* per-option distribution (the most-selected Option is its top entry).

### Shareable Link
The public URL that reaches a Form's **Renderer**. Built from the Form's unguessable public identifier, distinct from its database id.

## Surfaces

### Builder
The admin surface for authoring a **Form** — adding/removing Fields, setting Options and constraints, and saving the schema.

### Renderer
The public surface that fetches a **Form**'s schema by its **Shareable Link**, renders its Fields dynamically, and submits a **Response**.

### Response Viewer
The admin surface that lists a Form's **Responses** in a table with one column per Field.

### Analytics Dashboard
The admin surface that presents a Form's **Analytics** as KPI cards and charts.

> There is no authenticated actor. "Admin" denotes a surface, not a secured role.
