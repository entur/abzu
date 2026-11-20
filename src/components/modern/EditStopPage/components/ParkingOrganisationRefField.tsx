import { TextField } from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import { StopPlaceActions } from "../../../../actions";
import { isValidOrganisationRef } from "../../../../models/parkingOrganisationRef";
import { useAppDispatch } from "../../../../store/hooks";

interface ParkingOrganisationRefFieldProps {
  organisationRef?: string | null;
  organisationRefChanged?: boolean;
  parkingIndex: number;
  disabled: boolean;
}

const ORGANISATION_REF_MAX_LENGTH = 255;

/**
 * Text field for the reference to the organisation that operates a parking.
 * A blank field is saved as null, which clears the stored value. The field
 * shows an error only for a value that the editor changed.
 */
export const ParkingOrganisationRefField: React.FC<
  ParkingOrganisationRefFieldProps
> = ({ organisationRef, organisationRefChanged, parkingIndex, disabled }) => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const hasError =
    Boolean(organisationRefChanged) && !isValidOrganisationRef(organisationRef);

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
      error={hasError}
      helperText={formatMessage({
        id: hasError
          ? "parking_organisation_ref_error"
          : "parking_organisation_ref_helper",
      })}
      slotProps={{ htmlInput: { maxLength: ORGANISATION_REF_MAX_LENGTH } }}
      size="small"
      fullWidth
    />
  );
};
