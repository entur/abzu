import { FormControlLabel } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import React, { ReactElement } from "react";
import { useIntl } from "react-intl";
import { AssistanceTabItem as AssistanceEnum } from "../Assistance/types";
import {
  FacilityTabItemDetail as FacilityDetailEnum,
  FacilityTabItem as FacilityEnum,
} from "../Facility/types";

interface Props {
  icon: ReactElement<any>;
  handleFeatureStateChange: (newState: boolean) => void;
  name: FacilityEnum | FacilityDetailEnum | AssistanceEnum;
  isFeaturePresent: boolean;
}

const FeatureCheckbox = ({
  icon,
  handleFeatureStateChange,
  isFeaturePresent,
  name,
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
            checked={isFeaturePresent}
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
              handleFeatureStateChange(v);
            }}
          />
        }
        label={
          <div style={{ fontSize: "0.8em" }}>
            {isFeaturePresent
              ? formatMessage({ id: name })
              : formatMessage({ id: `${name}_no` })}
          </div>
        }
      />
    </>
  );
};

export default FeatureCheckbox;
