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

import { FormControlLabel } from "@mui/material";
import RaisedButton from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Menu from "@mui/material/Menu";
import React from "react";

class ColumnFilterPopover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  handleTouchTap(event) {
    event.preventDefault();
    this.setState({
      anchorEl: event.currentTarget,
      open: true,
    });
  }

  render() {
    const {
      columnOptions,
      buttonLabel,
      captionLabel,
      selectAllLabel,
      formatMessage,
    } = this.props;
    const optionStyle = {
      padding: 5,
    };

    const allIsChecked =
      columnOptions.filter((opt) => opt.checked).length ===
      columnOptions.length;

    return (
      <div style={this.props.style}>
        <RaisedButton onClick={this.handleTouchTap.bind(this)}>
          {buttonLabel}
        </RaisedButton>
        <Menu
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
          targetOrigin={{ horizontal: "left", vertical: "top" }}
          onClose={() => {
            this.setState({ open: false });
          }}
        >
          <div
            style={{
              width: "100%",
              fontSize: 12,
              padding: 5,
              background: "#000",
              marginTop: -8,
            }}
          >
            <span style={{ color: "#fff", textTransform: "capitalize" }}>
              {captionLabel}
            </span>
          </div>
          {columnOptions.map((option) => (
            <div style={optionStyle} key={"option-" + option.id}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={option.checked}
                    onChange={(e, checked) => {
                      this.props.handleColumnCheck(option.id, checked);
                    }}
                  />
                }
                label={formatMessage({
                  id: `report_columnNames_${option.id}`,
                })}
              />
            </div>
          ))}
          <div
            style={{ ...optionStyle, borderTop: "1px solid black" }}
            key={"option-all"}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={allIsChecked}
                  onChange={(e, checked) => {
                    this.props.handleCheckAll(checked);
                  }}
                />
              }
              label={selectAllLabel}
            />
          </div>
        </Menu>
      </div>
    );
  }
}

export default ColumnFilterPopover;
