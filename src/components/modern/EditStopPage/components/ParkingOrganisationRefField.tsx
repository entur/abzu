import { TextField } from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import { StopPlaceActions } from "../../../../actions";
import { useAppDispatch } from "../../../../store/hooks";

interface ParkingOrganisationRefFieldProps {
  organisationRef?: string | null;
  parkingIndex: number;
  disabled: boolean;
}

const ORGANISATION_REF_MAX_LENGTH = 255;

/**
 * Text field for the reference to the organisation that operates a parking.
 * A blank field is saved as null, which clears the stored value.
 */
export const ParkingOrganisationRefField: React.FC<
  ParkingOrganisationRefFieldProps
> = ({ organisationRef, parkingIndex, disabled }) => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();

  return (
    <TextField
      label={formatMessage({ id: "parking_organisation_ref" })}
      value={organisationRef || ""}
      onChange={(event) =>
        dispatch(
          StopPlaceActions.changeParkingOrganisationRef(
            parkingIndex,
            event.target.value,
          ),
        )
      }
      disabled={disabled}
      slotProps={{ htmlInput: { maxLength: ORGANISATION_REF_MAX_LENGTH } }}
      size="small"
      fullWidth
    />
  );
};
