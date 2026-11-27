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

import { countVerdicts } from "./tourSummaryCounts";
import { answerOf, TourSession, Verdict } from "./tourSessionStore";

export const FEEDBACK_FORMAT = "abzu-tour-feedback/1";

export interface FeedbackContext {
  appVersion: string;
  host: string;
  viewport: { width: number; height: number };
  language: string;
  exportedAt: Date;
}

/** Texts in the tester's UI language; the JSON block stays language-neutral. */
export interface FeedbackLabels {
  heading: string;
  summary: string;
  steps: string;
  generalComment: string;
  data: string;
  unanswered: string;
  verdicts: Record<Verdict, string>;
  counts: string;
}

const VERDICT_MARK: Record<Verdict, string> = {
  works: "✅",
  "not-fixed": "❌",
  "change-request": "✏️",
  skipped: "⏭️",
};

const quote = (text: string): string =>
  text
    .trim()
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n");

/** The data part: exact, so the next round can be read from it. */
export const buildFeedbackData = (
  session: TourSession,
  context: FeedbackContext,
) => ({
  format: FEEDBACK_FORMAT,
  tour: {
    title: session.tour.title,
    branch: session.tour.branch ?? null,
    appVersion: session.tour.appVersion ?? null,
  },
  run: {
    appVersion: context.appVersion,
    host: context.host,
    viewport: context.viewport,
    language: context.language,
    startedAt: session.startedAt,
    exportedAt: context.exportedAt.toISOString(),
  },
  counts: countVerdicts(session),
  steps: session.tour.steps.map((step) => {
    const { verdict, comment } = answerOf(session, step.id);
    return {
      id: step.id,
      title: step.title,
      verdict: verdict ?? null,
      comment: comment.trim(),
    };
  }),
  generalComment: session.generalComment.trim(),
});

/**
 * The feedback file the tester sends back: a readable summary and, at the
 * end, the same answers as a JSON block (`abzu-tour-feedback/1`).
 */
export const buildFeedbackMarkdown = (
  session: TourSession,
  context: FeedbackContext,
  labels: FeedbackLabels,
): string => {
  const data = buildFeedbackData(session, context);
  const tourLine = [session.tour.branch, session.tour.appVersion]
    .filter(Boolean)
    .join(" · ");
  const stepBlocks = data.steps.map(({ id, title, verdict, comment }) => {
    const status = verdict
      ? `${VERDICT_MARK[verdict]} ${labels.verdicts[verdict]}`
      : `○ ${labels.unanswered}`;
    return [`### ${id} · ${title} — ${status}`, comment ? quote(comment) : ""]
      .filter(Boolean)
      .join("\n\n");
  });

  return (
    [
      `# ${labels.heading}: ${session.tour.title}`,
      [
        tourLine && `- ${tourLine}`,
        `- ${context.host} · v${context.appVersion} · ${context.viewport.width}×${context.viewport.height} · ${context.language}`,
        `- ${session.startedAt} → ${data.run.exportedAt}`,
      ]
        .filter(Boolean)
        .join("\n"),
      `## ${labels.summary}`,
      labels.counts,
      `## ${labels.steps}`,
      ...stepBlocks,
      ...(data.generalComment
        ? [`## ${labels.generalComment}`, quote(data.generalComment)]
        : []),
      `## ${labels.data}`,
      "```json\n" + JSON.stringify(data, null, 2) + "\n```",
    ].join("\n\n") + "\n"
  );
};
