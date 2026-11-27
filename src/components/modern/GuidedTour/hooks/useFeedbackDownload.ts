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

import { useCallback } from "react";
import { useIntl } from "react-intl";
import { version as appVersion } from "../../../../../package.json";
import { buildFeedbackMarkdown, FeedbackLabels } from "../feedbackExport";
import { downloadTextFile, feedbackFileName } from "../feedbackFile";
import { countVerdicts } from "../tourSummaryCounts";
import type { TourSession } from "../tourSessionStore";

/** Builds the feedback file in the UI's language and downloads it. */
export const useFeedbackDownload = (session: TourSession): (() => void) => {
  const { formatMessage, locale } = useIntl();

  return useCallback(() => {
    const exportedAt = new Date();
    const labels: FeedbackLabels = {
      heading: formatMessage({ id: "guided_tour_feedback_heading" }),
      summary: formatMessage({ id: "guided_tour_finish" }),
      steps: formatMessage({ id: "guided_tour_feedback_steps" }),
      generalComment: formatMessage({ id: "guided_tour_general_comment" }),
      data: formatMessage({ id: "guided_tour_feedback_data" }),
      unanswered: formatMessage({ id: "guided_tour_feedback_unanswered" }),
      verdicts: {
        works: formatMessage({ id: "guided_tour_verdict_works" }),
        "not-fixed": formatMessage({ id: "guided_tour_verdict_not_fixed" }),
        "change-request": formatMessage({
          id: "guided_tour_verdict_change_request",
        }),
        skipped: formatMessage({ id: "guided_tour_verdict_skipped" }),
      },
      counts: formatMessage(
        { id: "guided_tour_summary_counts" },
        { ...countVerdicts(session) },
      ),
    };
    const markdown = buildFeedbackMarkdown(
      session,
      {
        appVersion,
        host: window.location.host,
        viewport: { width: window.innerWidth, height: window.innerHeight },
        language: locale,
        exportedAt,
      },
      labels,
    );
    downloadTextFile(
      feedbackFileName(session.tour.title, exportedAt),
      markdown,
    );
  }, [session, formatMessage, locale]);
};
