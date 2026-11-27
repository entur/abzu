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

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Box, Button, MenuItem, Select } from "@mui/material";
import { useIntl } from "react-intl";
import { answerOf, goToStep, TourSession } from "./tourSessionStore";
import { tourPopupZIndex } from "./tourLayers";
import { VerdictIcon } from "./VerdictIcon";

const STEP_MENU_MAX_HEIGHT = 360;

/** Previous / next, and a list to jump to any step or the summary. */
export const TourNavigation = ({ session }: { session: TourSession }) => {
  const { formatMessage } = useIntl();
  const { stepIndex, tour } = session;
  const summaryIndex = tour.steps.length;
  const isLastStep = stepIndex === summaryIndex - 1;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Button
        size="small"
        startIcon={<ChevronLeftIcon />}
        disabled={stepIndex === 0}
        onClick={() => goToStep(stepIndex - 1)}
      >
        {formatMessage({ id: "guided_tour_previous" })}
      </Button>
      <Select
        size="small"
        value={stepIndex}
        onChange={(event) => goToStep(Number(event.target.value))}
        sx={{ flex: 1, minWidth: 0 }}
        slotProps={{
          input: {
            "aria-label": formatMessage({ id: "guided_tour_go_to_step" }),
          },
        }}
        MenuProps={{
          sx: { zIndex: tourPopupZIndex },
          slotProps: { paper: { sx: { maxHeight: STEP_MENU_MAX_HEIGHT } } },
        }}
        renderValue={(value) =>
          value === summaryIndex
            ? formatMessage({ id: "guided_tour_finish" })
            : formatMessage(
                { id: "guided_tour_step_of" },
                { index: value + 1, count: summaryIndex },
              )
        }
      >
        {tour.steps.map((step, index) => (
          <MenuItem key={step.id} value={index} sx={{ gap: 1 }}>
            <VerdictIcon verdict={answerOf(session, step.id).verdict} />
            {index + 1}. {step.id} · {step.title}
          </MenuItem>
        ))}
        <MenuItem value={summaryIndex}>
          {formatMessage({ id: "guided_tour_finish" })}
        </MenuItem>
      </Select>
      <Button
        size="small"
        variant={isLastStep ? "contained" : "text"}
        endIcon={<ChevronRightIcon />}
        disabled={stepIndex === summaryIndex}
        onClick={() => goToStep(stepIndex + 1)}
      >
        {formatMessage({
          id: isLastStep ? "guided_tour_finish" : "guided_tour_next",
        })}
      </Button>
    </Box>
  );
};
