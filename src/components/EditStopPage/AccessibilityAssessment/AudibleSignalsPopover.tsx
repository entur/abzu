import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { useIntl } from "react-intl";
import {
  accessibilityAssessments,
  AccessibilityLimitationState,
} from "../../../models/accessibilityAssessments";

type Props = {
  disabled: boolean;
  displayLabel: boolean;
  audibleSignalsState: AccessibilityLimitationState;
  handleChange: (value: AccessibilityLimitationState) => {};
  quayId: string;
};

const AudibleSignalsPopover = ({
  disabled,
  displayLabel,
  audibleSignalsState,
  handleChange,
  quayId,
}: Props) => {
  const { formatMessage } = useIntl();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleAudibleSignalChange = (value: AccessibilityLimitationState) => {
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
      <div style={{ display: "flex", alignItems: "center", fontSize: "0.8em" }}>
        <IconButton
          onClick={(e) => {
            if (!disabled) handleOpenPopover(e);
          }}
        >
          <VolumeUpIcon
            style={{
              color: accessibilityAssessments.colors[audibleSignalsState],
            }}
          />
        </IconButton>
        {displayLabel ? (
          <div style={{ maginLeft: 5 }}>
            {formatMessage({
              id: `accessibilityAssessments_audibleSignals_${audibleSignalsState.toLowerCase()}`,
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
        targetOrigin={{ horizontal: "left", vertical: "top" }}
        onClose={handleClosePopover}
      >
        {accessibilityAssessments.audibleSignalsAvailable.options.map(
          (option, index) => (
            <MenuItem
              key={quayId + "-audioSignalsItem-" + index}
              value={option}
              style={{ padding: "0px 10px" }}
              onClick={() => {
                handleAudibleSignalChange(option);
              }}
            >
              <ListItemIcon>
                <VolumeUpIcon
                  style={{
                    float: "left",
                    marginTop: 9,
                    marginRight: 5,
                    color: accessibilityAssessments.colors[option],
                  }}
                />
              </ListItemIcon>
              <ListItemText>
                {formatMessage({
                  id: `accessibilityAssessments_audibleSignals_${option.toLowerCase()}`,
                })}
              </ListItemText>
            </MenuItem>
          ),
        )}
      </Menu>
    </div>
  );
};

export default AudibleSignalsPopover;
