import { FormControlLabel } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import React, { ReactElement } from "react";
import { useIntl } from "react-intl";
import {
  FacilityDetail as FacilityDetailEnum,
  Facility as FacilityEnum,
} from "./types";

interface Props {
  icon: ReactElement<any>;
  handleFacilityChange: (newState: boolean) => void;
  facilityName: FacilityEnum | FacilityDetailEnum;
  isFacilityPresent: boolean;
}

const FacilityCheckbox = ({
  icon,
  handleFacilityChange,
  isFacilityPresent,
  facilityName,
}: Props) => {
  const { formatMessage } = useIntl();

  return (
    <>
      <FormControlLabel
        style={{
          marginLeft: 0,
        }}
        control={
          <Checkbox
            checked={isFacilityPresent}
            checkedIcon={
              React.cloneElement(icon, {
                style: {
                  fill: "#000",
                },
              }) as React.ReactNode
            }
            icon={
              React.cloneElement(icon, {
                style: {
                  fill: "#8c8c8c",
                  opacity: "0.8",
                },
              }) as React.ReactNode
            }
            style={{ width: "auto" }}
            onChange={(e, v) => {
              handleFacilityChange(v);
            }}
          />
        }
        label={
          <div style={{ fontSize: "0.8em" }}>
            {isFacilityPresent
              ? formatMessage({ id: facilityName })
              : formatMessage({ id: `${facilityName}_no` })}
          </div>
        }
      />
    </>
  );
};

export default FacilityCheckbox;
