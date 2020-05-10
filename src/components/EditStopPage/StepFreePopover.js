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

import React from "react";
import MenuItem from "material-ui/MenuItem";
import accessibilityAssessments from "../../models/accessibilityAssessments";
import { Popover, PopoverAnimationVertical } from "material-ui/Popover";
import StairsIcon from "../../static/icons/accessibility/Stairs";
import IconButton from "material-ui/IconButton";

class StepFreePopover extends React.Component {
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
    const { intl, displayLabel, stepFreeAccess, disabled } = this.props;
    const { formatMessage } = intl;
    const { open, anchorEl } = this.state;

    return (
      <div>
        <div
          style={{ display: "flex", alignItems: "center", fontSize: "0.8em" }}
        >
          <IconButton
            style={{ borderBottom: disabled ? "none" : "1px dotted grey" }}
            onClick={(e) => {
              if (!disabled) this.handleOpenPopover(e);
            }}
          >
            <StairsIcon
              color={accessibilityAssessments.colors[stepFreeAccess]}
            />
          </IconButton>
          {displayLabel ? (
            <div style={{ maginLeft: 5 }}>
              {formatMessage({
                id: `accessibilityAssessments.stepFreeAccess.${stepFreeAccess.toLowerCase()}`,
              })}
            </div>
          ) : (
            ""
          )}
        </div>
        <Popover
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
          targetOrigin={{ horizontal: "left", vertical: "top" }}
          onRequestClose={this.handleClosePopover.bind(this)}
          animation={PopoverAnimationVertical}
        >
          {accessibilityAssessments.stepFreeAccess.options.map(
            (option, index) => (
              <MenuItem
                key={"wheelChairItem" + index}
                value={option}
                style={{ padding: "0px 10px" }}
                onClick={() => {
                  this.handleChange(option);
                }}
                primaryText={formatMessage({
                  id: `accessibilityAssessments.stepFreeAccess.${option.toLowerCase()}`,
                })}
                secondaryText={
                  <StairsIcon
                    style={{
                      float: "left",
                      marginLeft: -18,
                      marginTop: 9,
                      marginRight: 5,
                      color: accessibilityAssessments.colors[option],
                    }}
                  />
                }
              />
            )
          )}
        </Popover>
      </div>
    );
  }
}

export default StepFreePopover;
