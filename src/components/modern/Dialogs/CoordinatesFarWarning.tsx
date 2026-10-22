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

import { Alert, Link } from "@mui/material";
import { useIntl } from "react-intl";
import type {
  CoordinatesReference,
  FarWarning,
} from "./hooks/useCoordinatesForm";

const METERS_PER_KILOMETER = 1000;

const REFERENCE_LABEL_ID: Record<CoordinatesReference["kind"], string> = {
  stop: "coordinates_reference_stop",
  quay: "coordinates_reference_quay",
  previous: "coordinates_reference_previous",
};

interface CoordinatesFarWarningProps {
  warning: FarWarning;
  referenceKind: CoordinatesReference["kind"];
  onUseSwapped: () => void;
}

/** "This is 312 km from the stop place", plus a swap offer (F-103). */
export const CoordinatesFarWarning = ({
  warning,
  referenceKind,
  onUseSwapped,
}: CoordinatesFarWarningProps) => {
  const { formatMessage, formatNumber } = useIntl();
  const { distanceMeters, swapped } = warning;
  const distance = formatNumber(distanceMeters / METERS_PER_KILOMETER, {
    maximumFractionDigits: 1,
  });

  return (
    <Alert severity="warning" sx={{ mt: 1.5 }}>
      {formatMessage(
        { id: "coordinates_far_from_reference" },
        {
          distance,
          reference: formatMessage({ id: REFERENCE_LABEL_ID[referenceKind] }),
        },
      )}
      {swapped && (
        <>
          {" "}
          <Link component="button" type="button" onClick={onUseSwapped}>
            {formatMessage(
              { id: "coordinates_did_you_mean" },
              { coordinates: `${swapped[0]}, ${swapped[1]}` },
            )}
          </Link>
        </>
      )}
    </Alert>
  );
};
