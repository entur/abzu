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

import DownloadIcon from "@mui/icons-material/Download";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import { useFeedbackDownload } from "./hooks/useFeedbackDownload";
import { countVerdicts } from "./tourSummaryCounts";
import {
  answerOf,
  goToStep,
  setGeneralComment,
  TourSession,
} from "./tourSessionStore";
import { VerdictIcon } from "./VerdictIcon";

const COMMENT_ROWS = 3;

/** After the last step: the counts, the steps that need work, a general comment. */
export const TourSummary = ({ session }: { session: TourSession }) => {
  const { formatMessage } = useIntl();
  const counts = countVerdicts(session);
  const downloadFeedback = useFeedbackDownload(session);
  const needsWork = session.tour.steps
    .map((step, index) => ({ step, index, answer: answerOf(session, step.id) }))
    .filter(
      ({ answer }) =>
        answer.verdict === "not-fixed" || answer.verdict === "change-request",
    );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 600 }}>
        {formatMessage({ id: "guided_tour_finish" })}
      </Typography>
      <Typography variant="body2">
        {formatMessage({ id: "guided_tour_summary_counts" }, { ...counts })}
      </Typography>
      {needsWork.length > 0 && (
        <Box component="ul" sx={{ m: 0, pl: 0, listStyle: "none" }}>
          {needsWork.map(({ step, index, answer }) => (
            <Box
              component="li"
              key={step.id}
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                cursor: "pointer",
                py: 0.25,
              }}
              onClick={() => goToStep(index)}
            >
              <VerdictIcon verdict={answer.verdict} />
              <Typography variant="body2" noWrap>
                {step.id} · {step.title}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
      <TextField
        multiline
        minRows={COMMENT_ROWS}
        size="small"
        label={formatMessage({ id: "guided_tour_general_comment" })}
        value={session.generalComment}
        onChange={(event) => setGeneralComment(event.target.value)}
      />
      <Button
        variant="contained"
        startIcon={<DownloadIcon />}
        onClick={downloadFeedback}
      >
        {formatMessage({ id: "guided_tour_download" })}
      </Button>
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        {formatMessage({ id: "guided_tour_download_hint" })}
      </Typography>
    </Box>
  );
};
