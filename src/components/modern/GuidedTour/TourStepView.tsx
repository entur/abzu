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

import { Alert, Box, Chip, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import type { TourStep } from "./tourFormat";
import { TourVerdictPicker } from "./TourVerdictPicker";
import { StepAnswer } from "./tourSessionStore";

interface TourStepViewProps {
  step: TourStep;
  intro?: string;
  answer: StepAnswer;
  onAnswer: (change: Partial<StepAnswer>) => void;
}

const sectionTitleSx = { fontWeight: 600, mt: 1 } as const;

/** One step: what to do, what to look for, what changed, and the answer. */
export const TourStepView = ({
  step,
  intro,
  answer,
  onAnswer,
}: TourStepViewProps) => {
  const { formatMessage } = useIntl();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      {intro && (
        <Alert severity="info" sx={{ mb: 1 }}>
          {intro}
        </Alert>
      )}
      <Box
        sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1 }}
      >
        <Chip size="small" label={step.id} color="primary" variant="outlined" />
        {step.area && (
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {step.area}
          </Typography>
        )}
        {step.needsLogin && (
          <Chip
            size="small"
            label={formatMessage({ id: "guided_tour_needs_login" })}
          />
        )}
      </Box>
      <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 600 }}>
        {step.title}
      </Typography>

      <Typography variant="body2" sx={sectionTitleSx}>
        {formatMessage({ id: "guided_tour_do_this" })}
      </Typography>
      <Box component="ol" sx={{ m: 0, pl: 3 }}>
        {step.instructions.map((instruction, index) => (
          <Typography component="li" variant="body2" key={index}>
            {instruction}
          </Typography>
        ))}
      </Box>

      {step.expected && (
        <>
          <Typography variant="body2" sx={sectionTitleSx}>
            {formatMessage({ id: "guided_tour_expected" })}
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 3 }}>
            {step.expected.map((expected, index) => (
              <Typography component="li" variant="body2" key={index}>
                {expected}
              </Typography>
            ))}
          </Box>
        </>
      )}

      {step.changed && (
        <>
          <Typography variant="body2" sx={sectionTitleSx}>
            {formatMessage({ id: "guided_tour_changed" })}
          </Typography>
          <Typography variant="body2">{step.changed}</Typography>
        </>
      )}

      <Box sx={{ mt: 1.5 }}>
        <TourVerdictPicker answer={answer} onChange={onAnswer} />
      </Box>
    </Box>
  );
};
