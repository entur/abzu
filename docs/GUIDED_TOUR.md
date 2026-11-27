# Guided test tour

A small test rig inside the modern UI. The developer writes a **tour file** that lists the changes to check, one step each. The tester **uploads it in the running app**, follows each step's instructions, and gives a verdict and comment per step. The answers come back as a **feedback file** that the next round of fixes can start from.

The rig only shows text and stores answers in the tester's browser. It never navigates, clicks or saves anything for the tester, and nothing in a tour file is run as code.

## Turning it on

Add the feature flag to the deployment's `bootstrap.json` (dev and test environments; leave it off in production):

```json
"featureFlags": {
  "GuidedTour": true
}
```

The settings menu (⚙) then shows **Start a test tour…**.

## Running a tour (tester)

1. Open the app (the branch's dev or preview deployment) and log in if the tour needs it.
2. ⚙ → **Start a test tour…** → **Choose file…** → pick the tour file. The dialog shows the title, the number of steps and any problem with the file. If the tour was made for another app version, it warns.
3. **Start**. A panel docks at the bottom right (full width on a phone). For each step: do what **Do this** says, compare with **You should see**, then answer **Works**, **Not fixed** or **Change request**, and add a comment (required for a change request).
4. Move with **Previous** / **Next**, or jump to any step from the list (each step shows its answer). Minimise the panel to work in the app; it stays a small button.
5. After the last step, **Summary** shows the counts and a general comment field. **Download feedback** saves the feedback file; send it to the developer.

Answers are kept in the browser, so a reload or a later visit resumes the tour. Uploading the same tour again keeps the answers; another tour replaces them. **End test tour** deletes them, so download first.

While one of the app's dialogs is open, it keeps the keyboard focus. Close it before typing in the panel.

## Tour file (`abzu-tour/1`)

A JSON file with plain texts only.

| Field | Required | Description |
|---|---|---|
| `format` | yes | Always `"abzu-tour/1"` |
| `title` | yes | Shown in the panel and in the feedback file name |
| `branch` | no | The branch the tour was written for (shown to the tester) |
| `appVersion` | no | The app version it was written for; a different running version gives a warning |
| `intro` | no | Shown above the first step |
| `steps` | yes | 1–500 steps |

Each step:

| Field | Required | Description |
|---|---|---|
| `id` | yes | Unique within the tour, e.g. a finding or issue id (max 40 characters) |
| `title` | yes | What the step checks |
| `area` | no | Where in the app (shown as a label) |
| `needsLogin` | no | `true` shows "Needs login" |
| `instructions` | yes | What to do, in order (1–30 texts) |
| `expected` | no | What the tester should see when it works (1–30 texts) |
| `changed` | no | What changed compared with before |

Texts are at most 2000 characters (titles 200). A file with any error is rejected with a list of what's wrong.

### Example

```json
{
  "format": "abzu-tour/1",
  "title": "Search improvements",
  "branch": "feature/search-improvements",
  "appVersion": "1.700.0",
  "intro": "Three changes to the search field. Use any stop place you know.",
  "steps": [
    {
      "id": "SEARCH-1",
      "title": "Search shows that it is loading",
      "area": "Search",
      "instructions": ["Click the search field", "Type the name of a stop place quickly"],
      "expected": ["\"Loading …\" shows until the results arrive", "No \"No stop places found\" before that"],
      "changed": "Before: \"No stop places found\" flashed before the search had answered."
    },
    {
      "id": "SEARCH-2",
      "title": "Choosing a result closes the panel",
      "area": "Search",
      "needsLogin": true,
      "instructions": ["Make the window narrow (tablet width)", "Open search with the magnifier and pick a result"],
      "expected": ["The search panel closes and the stop opens"]
    }
  ]
}
```

## Writing good steps

- One change per step; the `id` should point back to where the change is tracked.
- Name buttons and fields with the text the tester sees in the UI, in the tester's language.
- Say where to start ("Open a stop you can edit"), and what not to do if it matters ("don't save").
- Put the visible result in `expected`, so "Works" means something checkable.
- Steps that need a save: tell the tester to use their own test objects.

## Feedback file (`abzu-tour-feedback/1`)

A Markdown file named `<tour-title>-feedback-<date>.md`: a readable summary in the tester's UI language (counts, each step with its verdict and comment, the general comment, app version, host, screen size) and, at the end, a JSON block with the same answers:

```json
{
  "format": "abzu-tour-feedback/1",
  "tour": { "title": "Search improvements", "branch": "feature/search-improvements", "appVersion": "1.700.0" },
  "run": { "appVersion": "1.700.0", "host": "…", "viewport": { "width": 1440, "height": 900 }, "language": "nb", "startedAt": "…", "exportedAt": "…" },
  "counts": { "works": 1, "notFixed": 0, "changeRequests": 1, "unanswered": 0 },
  "steps": [
    { "id": "SEARCH-1", "title": "Search shows that it is loading", "verdict": "works", "comment": "" },
    { "id": "SEARCH-2", "title": "Choosing a result closes the panel", "verdict": "change-request", "comment": "…" }
  ],
  "generalComment": ""
}
```

`verdict` is `"works"`, `"not-fixed"`, `"change-request"` or `null` (not answered).

## Where the code is

`src/components/modern/GuidedTour/`: `tourFormat.ts` (format and validation), `tourSessionStore.ts` (answers in localStorage), `feedbackExport.ts` (the feedback file), and the panel components. The flag is `featureFlags.GuidedTour` (`src/config/FeatureFlags.ts`).
