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

import { Box, Tooltip } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useIntl } from "react-intl";
import { Marker, useMap } from "react-map-gl/maplibre";
import { useAppSelector } from "../../../../store/hooks";
import type { StopPlaceCluster } from "./types";

const MIN_CLUSTER_SIZE = 32;
const ZOOM_STEP_FOR_SINGLE_POINT = 2;
const FIT_BOUNDS_PADDING = 80;

/** Diameter grows with the order of magnitude of the count, so large clusters stay readable */
export const clusterDiameter = (count: number) =>
  Math.round(MIN_CLUSTER_SIZE + 10 * Math.log10(Math.max(count, 1)));

interface ClusterMarkerItemProps {
  cluster: StopPlaceCluster;
}

const ClusterMarkerItem = ({ cluster }: ClusterMarkerItemProps) => {
  const { current: map } = useMap();
  const { formatMessage, formatNumber } = useIntl();
  const size = clusterDiameter(cluster.count);

  const zoomIn = () => {
    if (!map) return;
    const isSinglePoint =
      cluster.lonMin === cluster.lonMax && cluster.latMin === cluster.latMax;
    if (isSinglePoint) {
      map.flyTo({
        center: [cluster.longitude, cluster.latitude],
        zoom: map.getZoom() + ZOOM_STEP_FOR_SINGLE_POINT,
      });
    } else {
      map.fitBounds(
        [
          [cluster.lonMin, cluster.latMin],
          [cluster.lonMax, cluster.latMax],
        ],
        { padding: FIT_BOUNDS_PADDING },
      );
    }
  };

  return (
    <Marker
      latitude={cluster.latitude}
      longitude={cluster.longitude}
      anchor="center"
    >
      <Tooltip
        title={formatMessage(
          { id: "stop_place_cluster_tooltip" },
          { count: cluster.count },
        )}
        placement="top"
        arrow
      >
        <Box
          role="button"
          aria-label={formatMessage(
            { id: "stop_place_cluster_tooltip" },
            { count: cluster.count },
          )}
          onClick={zoomIn}
          sx={(theme) => ({
            width: size,
            height: size,
            borderRadius: "50%",
            bgcolor: alpha(theme.palette.primary.main, 0.85),
            color: "primary.contrastText",
            border: "3px solid",
            borderColor: alpha(theme.palette.primary.main, 0.35),
            backgroundClip: "padding-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: "0.8rem",
            cursor: "pointer",
            userSelect: "none",
            boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
            transition: "transform 0.15s",
            "&:hover": { transform: "scale(1.1)" },
          })}
        >
          {formatNumber(cluster.count, { notation: "compact" })}
        </Box>
      </Tooltip>
    </Marker>
  );
};

export const ClusterMarkers = () => {
  const clusters = useAppSelector(
    (state) =>
      (state.stopPlace as any).stopPlaceClusters as
        StopPlaceCluster[] | undefined,
  );

  if (!clusters?.length) return null;

  return (
    <>
      {clusters.map((cluster) => (
        <ClusterMarkerItem
          key={`${cluster.longitude},${cluster.latitude}`}
          cluster={cluster}
        />
      ))}
    </>
  );
};
