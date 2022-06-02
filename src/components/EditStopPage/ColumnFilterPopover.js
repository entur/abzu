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
import RaisedButton from "material-ui/RaisedButton";
import Menu from "material-ui/Menu";
import Checkbox from "material-ui/Checkbox";
import { Popover } from "@mui/material";

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
        <RaisedButton
          label={buttonLabel}
          labelStyle={{ fontSize: 12 }}
          onClick={this.handleTouchTap.bind(this)}
        />
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
          targetOrigin={{ horizontal: "left", vertical: "top" }}
          onClose={() => {
            this.setState({ open: false });
          }}
        >
          <Menu>
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
                <Checkbox
                  label={formatMessage({
                    id: `report.columnNames.${option.id}`,
                  })}
                  checked={option.checked}
                  onCheck={(e, checked) => {
                    this.props.handleColumnCheck(option.id, checked);
                  }}
                />
              </div>
            ))}
            <div
              style={{ ...optionStyle, borderTop: "1px solid black" }}
              key={"option-all"}
            >
              <Checkbox
                label={selectAllLabel}
                checked={allIsChecked}
                onCheck={(e, checked) => {
                  this.props.handleCheckAll(checked);
                }}
              />
            </div>
          </Menu>
        </Popover>
      </div>
    );
  }
}

export default ColumnFilterPopover;
