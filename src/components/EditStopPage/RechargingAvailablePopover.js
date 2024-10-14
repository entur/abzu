import React from "react";
import { injectIntl } from "react-intl";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import EvStation from "@mui/icons-material/EvStation";
import { colors as rechargingAvailableColors } from "../../models/rechargingAvailable";
import { Popover } from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import accessibilityAssessments from "../../models/accessibilityAssessments";

class RechargingAvailablePopover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      anchorEl: null,
    };
  }

  handleChange(value) {
    this.setState({
      open: false,
    });
    this.props.handleChange(value);
  }

  handleOpenPopover(event) {
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  }

  handleClosePopover() {
    this.setState({
      open: false,
    });
  }

  handleSelect(value) {
    this.props.handleSetRechargingAvailable(value);
    this.props.handleSetNumberOfSpacesWithRechargePoint(0);
    this.setState({
      open: false,
    });
  }

  render() {
    const {
      intl: { formatMessage },
      disabled,
      hasExpired,
      rechargingAvailableValue,
    } = this.props;

    const { open, anchorEl } = this.state;

    const evStationIconColor = (rechargingAvailable) => {
      if (rechargingAvailable === null)
        return rechargingAvailableColors.UNKNOWN;
      return rechargingAvailable
        ? rechargingAvailableColors.RECHARGING_AVAILABLE
        : rechargingAvailableColors.RECHARGING_NOT_AVAILABLE;
    };

    const rechargingAvailableMenuItems = [true, false].map((key) => (
      <MenuItem
        key={`rechargingAvailable_${key}`}
        value={key}
        onClick={() => this.handleSelect(key)}
      >
        <ListItemIcon>
          <EvStation
            style={{
              color: evStationIconColor(key),
            }}
          />
        </ListItemIcon>
        <ListItemText>
          {formatMessage({
            id: `parking_recharging_available_${key}`,
          })}
        </ListItemText>
      </MenuItem>
    ));

    return (
      <div>
        <div style={{ margin: "6px 6px 0 0", height: "56px" }}>
          <IconButton
            onClick={(e) => {
              if (!disabled && !hasExpired) this.handleOpenPopover(e);
            }}
          >
            <EvStation
              style={{
                color: evStationIconColor(rechargingAvailableValue),
              }}
            />
          </IconButton>
          <div
            style={{
              borderBottom: "1px dotted",
            }}
          ></div>
        </div>
        <Popover
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
          targetOrigin={{ horizontal: "left", vertical: "top" }}
          onClose={this.handleClosePopover.bind(this)}
        >
          {rechargingAvailableMenuItems}
        </Popover>
      </div>
    );
  }
}

export default injectIntl(RechargingAvailablePopover);
