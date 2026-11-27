/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
the European Commission - subsequent versions of the EUPL (the "Licence");
You may not use this work except in compliance with the Licence.
You may obtain a copy of the Licence at:

  https://joinup.ec.europa.eu/software/page/eupl

Unless required by applicable law or agreed to in writing, software
distributed under the Licence is distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the Licence for the specific language governing permissions and
limitations under the Licence. */

import { describe, expect, test } from "vitest";
import {
  buildFeedbackData,
  buildFeedbackMarkdown,
  FeedbackLabels,
} from "../components/modern/GuidedTour/feedbackExport";
import { feedbackFileName } from "../components/modern/GuidedTour/feedbackFile";
import type { TourSession } from "../components/modern/GuidedTour/tourSessionStore";

const session: TourSession = {
  tour: {
    format: "abzu-tour/1",
    title: "Runde 3: rettinger",
    branch: "fix/modern-ui-round-3",
    appVersion: "1.688.0",
    steps: ["F-58", "F-59", "F-60", "F-61"].map((id) => ({
      id,
      title: `Step ${id}`,
      instructions: ["Do it"],
    })),
  },
  stepIndex: 4,
  answers: {
    "F-58": { verdict: "works", comment: "" },
    "F-59": { verdict: "change-request", comment: "Wider list\nplease" },
    "F-61": { verdict: "skipped", comment: "No login" },
  },
  generalComment: "Good round",
  startedAt: "2026-11-27T10:00:00.000Z",
  isMinimised: false,
};

const context = {
  appVersion: "1.689.0",
  host: "stoppested.dev.entur.org",
  viewport: { width: 1440, height: 900 },
  language: "nb",
  exportedAt: new Date("2026-11-27T12:30:00.000Z"),
};

const labels: FeedbackLabels = {
  heading: "Tilbakemelding",
  summary: "Oppsummering",
  steps: "Steg",
  generalComment: "Generell kommentar",
  data: "Data",
  unanswered: "Ikke besvart",
  verdicts: {
    works: "Fungerer",
    "not-fixed": "Ikke fikset",
    "change-request": "Endringsønske",
    skipped: "Hoppet over",
  },
  counts: "1 · 0 · 1 · 1",
};

describe("feedback export", () => {
  const markdown = buildFeedbackMarkdown(session, context, labels);

  test("lists every step with its verdict, unanswered ones too", () => {
    expect(markdown).toContain("### F-58 · Step F-58 — ✅ Fungerer");
    expect(markdown).toContain("### F-59 · Step F-59 — ✏️ Endringsønske");
    expect(markdown).toContain("### F-60 · Step F-60 — ○ Ikke besvart");
    expect(markdown).toContain("### F-61 · Step F-61 — ⏭️ Hoppet over");
  });

  test("quotes comments line by line, and the general comment", () => {
    expect(markdown).toContain("> Wider list\n> please");
    expect(markdown).toContain("## Generell kommentar\n\n> Good round");
  });

  test("ends with a JSON block that parses back to the same data", () => {
    const block = markdown.match(/```json\n([\s\S]*?)\n```/)![1];
    expect(JSON.parse(block)).toEqual(buildFeedbackData(session, context));
    expect(JSON.parse(block)).toMatchObject({
      format: "abzu-tour-feedback/1",
      tour: { title: "Runde 3: rettinger", appVersion: "1.688.0" },
      run: { appVersion: "1.689.0", exportedAt: "2026-11-27T12:30:00.000Z" },
      counts: {
        works: 1,
        notFixed: 0,
        changeRequests: 1,
        skipped: 1,
        unanswered: 1,
      },
      steps: [
        { id: "F-58", verdict: "works", comment: "" },
        {
          id: "F-59",
          verdict: "change-request",
          comment: "Wider list\nplease",
        },
        { id: "F-60", verdict: null, comment: "" },
        { id: "F-61", verdict: "skipped", comment: "No login" },
      ],
    });
  });

  test("names the file after the tour and the date", () => {
    expect(feedbackFileName("Runde 3: rettinger", context.exportedAt)).toBe(
      "runde-3-rettinger-feedback-2026-11-27.md",
    );
    expect(feedbackFileName("Sjøstrand Æøå", context.exportedAt)).toBe(
      "sjostrand-aeoa-feedback-2026-11-27.md",
    );
  });
});
