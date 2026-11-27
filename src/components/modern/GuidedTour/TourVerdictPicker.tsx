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

import SkipNextIcon from "@mui/icons-material/SkipNext";
import {
  Box,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useId } from "react";
import { useIntl } from "react-intl";
import type { StepAnswer, Verdict } from "./tourSessionStore";

type JudgingVerdict = Exclude<Verdict, "skipped">;

const VERDICT_LABELS: Record<JudgingVerdict, string> = {
  works: "guided_tour_verdict_works",
  "not-fixed": "guided_tour_verdict_not_fixed",
  "change-request": "guided_tour_verdict_change_request",
};
const VERDICT_COLORS: Record<JudgingVerdict, "success" | "error" | "warning"> =
  {
    works: "success",
    "not-fixed": "error",
    "change-request": "warning",
  };
const COMMENT_ROWS = 3;

interface TourVerdictPickerProps {
  answer: StepAnswer;
  needsLogin?: boolean;
  onChange: (change: Partial<StepAnswer>) => void;
}

/**
 * Works / Not fixed / Change request, a separate Skip for a step the tester
 * can't test (e.g. it needs a login they don't have), and a comment.
 */
export const TourVerdictPicker = ({
  answer,
  needsLogin = false,
  onChange,
}: TourVerdictPickerProps) => {
  const { formatMessage } = useIntl();
  const labelId = useId();
  const isChangeRequest = answer.verdict === "change-request";
  const isSkipped = answer.verdict === "skipped";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Typography id={labelId} variant="subtitle2">
        {formatMessage({ id: "guided_tour_verdict_label" })}
      </Typography>
      <ToggleButtonGroup
        exclusive
        size="small"
        fullWidth
        value={answer.verdict ?? null}
        aria-labelledby={labelId}
        onChange={(_event, verdict: Verdict | null) =>
          onChange({ verdict: verdict ?? undefined })
        }
      >
        {(Object.keys(VERDICT_LABELS) as JudgingVerdict[]).map((verdict) => (
          <ToggleButton
            key={verdict}
            value={verdict}
            color={VERDICT_COLORS[verdict]}
            sx={{ textTransform: "none" }}
          >
            {formatMessage({ id: VERDICT_LABELS[verdict] })}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <Box
        sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1 }}
      >
        <ToggleButton
          value="skipped"
          size="small"
          selected={isSkipped}
          onChange={() =>
            onChange({ verdict: isSkipped ? undefined : "skipped" })
          }
          sx={{ textTransform: "none", gap: 0.5 }}
        >
          <SkipNextIcon fontSize="small" />
          {formatMessage({ id: "guided_tour_verdict_skipped" })}
        </ToggleButton>
        {needsLogin && (
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {formatMessage({ id: "guided_tour_skip_login_hint" })}
          </Typography>
        )}
      </Box>
      <TextField
        multiline
        minRows={COMMENT_ROWS}
        size="small"
        value={answer.comment}
        required={isChangeRequest}
        label={formatMessage({
          id: isChangeRequest
            ? "guided_tour_comment_change_request"
            : "guided_tour_comment",
        })}
        helperText={formatMessage({ id: "guided_tour_dialog_hint" })}
        onChange={(event) => onChange({ comment: event.target.value })}
      />
    </Box>
  );
};
