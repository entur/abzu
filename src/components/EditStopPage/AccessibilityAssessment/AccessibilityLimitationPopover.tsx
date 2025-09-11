import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, { ReactElement, useState } from "react";
import { useIntl } from "react-intl";
import {
  accessibilityAssessmentColors,
  accessibilityAssessments,
} from "../../../models/accessibilityAssessments";
import {
  AccessibilityLimitation,
  AccessibilityLimitationType,
} from "../../../models/AccessibilityLimitation";

type Props = {
  disabled?: boolean;
  displayLabel?: boolean;
  accessibilityLimitationState: AccessibilityLimitationType;
  accessibilityLimitationName: AccessibilityLimitation;
  icon: ReactElement<any>;
  handleChange: (value: AccessibilityLimitationType) => {};
  quayId?: string;
};

const AccessibilityLimitationPopover = ({
  disabled,
  displayLabel,
  accessibilityLimitationState,
  accessibilityLimitationName,
  handleChange,
  quayId,
  icon,
}: Props) => {
  const { formatMessage } = useIntl();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleAccessibilityLimitationStateChange = (
    value: AccessibilityLimitationType,
  ) => {
    setOpen(false);
    handleChange(value);
  };

  const handleOpenPopover = (event: any) => {
    setOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpen(false);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <IconButton
          onClick={(e) => {
            if (!disabled) handleOpenPopover(e);
          }}
        >
          {React.cloneElement(icon, {
            style: {
              color:
                accessibilityAssessmentColors[
                  accessibilityLimitationState ||
                    AccessibilityLimitationType.UNKNOWN
                ],
            },
          })}
        </IconButton>
        {displayLabel ? (
          <div style={{ marginLeft: 2.5 }}>
            {formatMessage({
              id: `accessibilityAssessments_${accessibilityLimitationName}_${(accessibilityLimitationState || AccessibilityLimitationType.UNKNOWN).toLowerCase()}`,
            })}
          </div>
        ) : (
          ""
        )}
      </div>
      <Menu
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        onClose={handleClosePopover}
      >
        {accessibilityAssessments[accessibilityLimitationName].options.map(
          (option: AccessibilityLimitationType, index: number) => (
            <MenuItem
              key={`${quayId}-${accessibilityLimitationName}-${index}`}
              value={option}
              style={{ padding: "0px 10px" }}
              onClick={() => {
                handleAccessibilityLimitationStateChange(option);
              }}
            >
              <ListItemIcon>
                {React.cloneElement(icon, {
                  style: {
                    float: "left",
                    marginTop: 9,
                    marginRight: 5,
                    color: accessibilityAssessmentColors[option],
                  },
                })}
              </ListItemIcon>
              <ListItemText>
                {formatMessage({
                  id: `accessibilityAssessments_${accessibilityLimitationName}_${option.toLowerCase()}`,
                })}
              </ListItemText>
            </MenuItem>
          ),
        )}
      </Menu>
    </div>
  );
};

export default AccessibilityLimitationPopover;
