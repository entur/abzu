import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import { StopPlaceActions } from "../../../../actions";
import { CoveredEnum } from "../../../../models/Covered";
import { useAppDispatch } from "../../../../store/hooks";

interface ParkingCoveredFieldProps {
  covered?: string | null;
  parkingIndex: number;
  disabled: boolean;
}

const coveredMessageId = (value: string): string =>
  `covered_${value.toLowerCase()}`;

/**
 * Select for whether a parking is covered. It shows any stored value, but the
 * list holds only the values the NeTEx Nordic profile allows.
 */
export const ParkingCoveredField: React.FC<ParkingCoveredFieldProps> = ({
  covered,
  parkingIndex,
  disabled,
}) => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const label = formatMessage({ id: "parking_covered" });

  return (
    <FormControl fullWidth size="small" disabled={disabled}>
      <InputLabel shrink>{label}</InputLabel>
      <Select
        value={covered || ""}
        displayEmpty
        notched
        label={label}
        renderValue={(selected: string) =>
          selected ? (
            formatMessage({
              id: coveredMessageId(selected),
              defaultMessage: selected,
            })
          ) : (
            <em>{formatMessage({ id: "parking_covered_undefined" })}</em>
          )
        }
        onChange={(event) =>
          dispatch(
            StopPlaceActions.changeParkingCovered(
              parkingIndex,
              event.target.value,
            ),
          )
        }
      >
        <MenuItem value="">
          <em>{formatMessage({ id: "parking_covered_undefined" })}</em>
        </MenuItem>
        {Object.values(CoveredEnum).map((value) => (
          <MenuItem key={value} value={value}>
            {formatMessage({
              id: coveredMessageId(value),
              defaultMessage: value,
            })}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
