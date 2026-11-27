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

import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import {
  Box,
  Button,
  Divider,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useIntl } from "react-intl";
import { TourEndDialog } from "./TourEndDialog";
import { tourPanelZIndex } from "./tourLayers";
import { TourNavigation } from "./TourNavigation";
import { TourPanelHeader } from "./TourPanelHeader";
import { TourStepView } from "./TourStepView";
import { TourSummary } from "./TourSummary";
import {
  answerOf,
  endTourSession,
  setMinimised,
  setStepAnswer,
  TourSession,
} from "./tourSessionStore";

const EDGE = 16;
const PANEL_WIDTH = 400;
const PANEL_MAX_HEIGHT = "70vh";
const PHONE_MAX_HEIGHT = "55vh";

/**
 * The running tour, docked bottom-right (full width on a phone) above the
 * map, the drawers and dialogs, so the instructions stay in view while the
 * tester works in the app. Minimised it is a small pill.
 */
export const TourPanel = ({ session }: { session: TourSession }) => {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.down("sm"));
  const [isConfirmingEnd, setIsConfirmingEnd] = useState(false);
  const { tour, stepIndex, isMinimised } = session;
  const step = tour.steps[stepIndex];
  const progress = step
    ? formatMessage(
        { id: "guided_tour_step_of" },
        { index: stepIndex + 1, count: tour.steps.length },
      )
    : formatMessage({ id: "guided_tour_finish" });
  const placement = isPhone
    ? { left: EDGE / 2, right: EDGE / 2, bottom: EDGE / 2 }
    : { right: EDGE, bottom: EDGE, width: PANEL_WIDTH };
  const zIndex = tourPanelZIndex(theme);

  if (isMinimised) {
    return (
      <Button
        variant="contained"
        startIcon={<FactCheckOutlinedIcon />}
        onClick={() => setMinimised(false)}
        sx={{
          position: "fixed",
          right: EDGE,
          bottom: EDGE,
          zIndex,
          textTransform: "none",
        }}
      >
        {formatMessage({ id: "guided_tour_menu_show" })} · {progress}
      </Button>
    );
  }

  return (
    <>
      <Paper
        elevation={8}
        role="complementary"
        aria-label={tour.title}
        sx={{
          position: "fixed",
          ...placement,
          zIndex,
          maxHeight: isPhone ? PHONE_MAX_HEIGHT : PANEL_MAX_HEIGHT,
          display: "flex",
          flexDirection: "column",
          borderRadius: 2,
        }}
      >
        <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
          <TourPanelHeader
            title={tour.title}
            progress={progress}
            onMinimise={() => setMinimised(true)}
            onEnd={() => setIsConfirmingEnd(true)}
          />
        </Box>
        <Divider />
        <Box sx={{ px: 2, py: 1.5, overflowY: "auto", flex: 1 }}>
          {step ? (
            <TourStepView
              key={step.id}
              step={step}
              intro={stepIndex === 0 ? tour.intro : undefined}
              answer={answerOf(session, step.id)}
              onAnswer={(change) => setStepAnswer(step.id, change)}
            />
          ) : (
            <TourSummary session={session} />
          )}
        </Box>
        <Divider />
        <Box sx={{ px: 1, py: 1 }}>
          <TourNavigation session={session} />
        </Box>
      </Paper>
      <TourEndDialog
        open={isConfirmingEnd}
        onConfirm={() => {
          setIsConfirmingEnd(false);
          endTourSession();
        }}
        onClose={() => setIsConfirmingEnd(false)}
      />
    </>
  );
};
