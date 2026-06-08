# Restaurant Loader Plan

## Goal

Build a progressive restaurant loader that streams restaurant updates to the browser as soon as each restaurant finishes loading.

## Approach

1. Keep the existing demo stream as a reference.
2. Add a reusable concurrency helper.
3. Create `/api/restaurants/stream`.
4. Send the restaurant list first so the UI can render table rows immediately.
5. Fetch restaurant details with a maximum of 5 active requests.
6. Stream each success or error as newline-delimited JSON.
7. Update the table row-by-row on the frontend.
8. Show live progress.
9. Document final assumptions in `FINAL.md`.

---

## AI Prompts Used

### Architecture Planning

Prompt:

> Review the challenge requirements and propose a simple implementation plan focused on progressive streaming, concurrency control, and incremental UI updates. Prioritize completing the core requirements before attempting any bonus features.

Outcome:

* Created a reusable concurrency helper.
* Added a dedicated restaurant loader module.
* Used NDJSON streaming for progressive updates.
* Kept route definitions separate from loading logic.

### Concurrency Control

Prompt:

> Implement a concurrency-limited task runner that maintains exactly 5 active requests at a time without loading all restaurants simultaneously.

Outcome:

* Implemented `runWithConcurrency`.
* Maintained a maximum of 5 concurrent API requests.
* Streamed results as individual requests completed.

### Progressive Frontend Updates

Prompt:

> Update the UI incrementally as restaurant updates arrive from the stream. Avoid re-rendering the entire table and update only the affected row.

Outcome:

* Rendered the initial table immediately.
* Stored row references in a `Map`.
* Updated only the affected row when new data arrived.

### Styling

Prompt:

> Apply lightweight professional styling suitable for a take-home assessment. Keep the design simple, readable, and easy to review without introducing additional frameworks or complexity.

Outcome:

* Added responsive container styling.
* Improved table readability.
* Added visual status indicators for Loading, Loaded, and Error states.
* Kept styling framework-free using basic CSS only.

### Bonus Investigation

Prompt:

> Explore menu loading while preserving the shared concurrency limit and ensuring menu failures do not interrupt restaurant detail streaming.

Outcome:

* Investigated menu loading.
* Identified API limitations related to menu identifiers.
* Prioritized a stable implementation of the core requirements.
