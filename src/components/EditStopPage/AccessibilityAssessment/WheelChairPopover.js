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

import WheelChair from "@mui/icons-material/Accessible";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import React from "react";
import { accessibilityAssessments } from "../../../models/accessibilityAssessments";

import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";

class WheelChairPopover extends React.Component {
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

  render() {
    const { intl, displayLabel, wheelchairAccess, disabled } = this.props;
    const { formatMessage } = intl;
    const { open, anchorEl } = this.state;

    return (
      <div>
        <div
          style={{ display: "flex", alignItems: "center", fontSize: "0.8em" }}
        >
          <IconButton
            onClick={(e) => {
              if (!disabled) this.handleOpenPopover(e);
            }}
          >
            <WheelChair
              style={{
                color: accessibilityAssessments.colors[wheelchairAccess],
              }}
            />
          </IconButton>
          {displayLabel ? (
            <div style={{ marginLeft: 5 }}>
              {formatMessage({
                id: `accessibilityAssessments_wheelchairAccess_${wheelchairAccess.toLowerCase()}`,
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
          onClose={this.handleClosePopover.bind(this)}
        >
          {accessibilityAssessments.wheelchairAccess.options.map(
            (option, index) => (
              <MenuItem
                key={"wheelChairItem" + index}
                value={option}
                style={{ padding: "0px 10px" }}
                onClick={() => {
                  this.handleChange(option);
                }}
              >
                <ListItemIcon>
                  <WheelChair
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
                    id: `accessibilityAssessments_wheelchairAccess_${option.toLowerCase()}`,
                  })}
                </ListItemText>
              </MenuItem>
            ),
          )}
        </Menu>
      </div>
    );
  }
}

export default WheelChairPopover;
