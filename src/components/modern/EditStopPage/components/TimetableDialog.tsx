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

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CloseIcon from "@mui/icons-material/Close";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import {
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { checkStopPlaceUsage } from "../../../../graphql/OTP/actions";

interface Line {
  id: string;
  publicCode: string | null;
  lineName: string | null;
  authorityName: string;
  serviceJourneyCount: number;
  latestActiveDate: string | null;
}

interface TimetableDialogProps {
  open: boolean;
  onClose: () => void;
  stopPlaceId: string;
  stopPlaceName: string;
}

/**
 * Fetches active routes (lines) for a stop place via the OTP API and displays
 * them grouped by authority. Results are deduplicated across quays.
 */
export const TimetableDialog: React.FC<TimetableDialogProps> = ({
  open,
  onClose,
  stopPlaceId,
  stopPlaceName,
}) => {
  const { formatMessage } = useIntl();
  const [loading, setLoading] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !stopPlaceId) return;

    setLoading(true);
    setError(null);
    setLines([]);

    checkStopPlaceUsage(stopPlaceId)
      .then((result: any) => {
        const quays: any[] = result?.data?.stopPlace?.quays ?? [];

        // Aggregate lines across all quays, deduplicated by line.id
        const lineMap = new Map<string, Line>();
        for (const quay of quays) {
          for (const line of quay.lines ?? []) {
            if (lineMap.has(line.id)) continue;
            const allDates: string[] = (line.serviceJourneys ?? []).flatMap(
              (sj: any) => sj.activeDates ?? [],
            );
            const latestActiveDate =
              allDates.length > 0
                ? ([...allDates].sort().at(-1) ?? null)
                : null;
            lineMap.set(line.id, {
              id: line.id,
              publicCode: line.publicCode ?? null,
              lineName: line.name ?? null,
              authorityName: line.authority?.name ?? "",
              serviceJourneyCount: line.serviceJourneys?.length ?? 0,
              latestActiveDate,
            });
          }
        }

        setLines(Array.from(lineMap.values()));
      })
      .catch(() => {
        setError(formatMessage({ id: "timetable_error" }));
      })
      .finally(() => setLoading(false));
  }, [open, stopPlaceId]);

  // Group lines by authority name
  const byAuthority = lines.reduce<Record<string, Line[]>>((acc, line) => {
    const key = line.authorityName || "—";
    (acc[key] ??= []).push(line);
    return acc;
  }, {});

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{ display: "flex", alignItems: "center", gap: 1, pr: 6 }}
      >
        <DirectionsBusIcon fontSize="small" color="primary" />
        <Typography variant="subtitle1" fontWeight={600} component="span">
          {formatMessage({ id: "timetable" })}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          noWrap
          component="span"
        >
          — {stopPlaceName}
        </Typography>
        <Tooltip title={formatMessage({ id: "close" })}>
          <IconButton
            size="small"
            onClick={onClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </DialogTitle>

      <DialogContent dividers sx={{ minHeight: 120 }}>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={32} />
          </Box>
        )}

        {!loading && error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}

        {!loading && !error && lines.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            {formatMessage({ id: "no_active_lines" })}
          </Typography>
        )}

        {!loading &&
          !error &&
          lines.length > 0 &&
          Object.entries(byAuthority).map(([authority, authorityLines], i) => (
            <Box key={authority}>
              {i > 0 && <Divider sx={{ my: 1 }} />}
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
                sx={{ display: "block", mb: 0.5 }}
              >
                {authority}
              </Typography>
              {authorityLines.map((line) => (
                <Box
                  key={line.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    py: 0.5,
                    flexWrap: "wrap",
                  }}
                >
                  <Chip
                    label={line.publicCode ?? line.id.split(":").pop()}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ minWidth: 40 }}
                  />
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    {line.lineName ?? ""}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {line.serviceJourneyCount}{" "}
                    {formatMessage({ id: "service_journeys" })}
                  </Typography>
                  {line.latestActiveDate && (
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <CalendarMonthIcon sx={{ fontSize: 14 }} color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {line.latestActiveDate}
                      </Typography>
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          ))}
      </DialogContent>
    </Dialog>
  );
};
