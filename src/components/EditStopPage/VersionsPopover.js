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

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PropTypes from "prop-types";
import { Component } from "react";
import { injectIntl } from "react-intl";
import "../../styles/version.css";
import { sortVersions } from "../../utils";

class VersionsPopover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      anchorEl: null,
    };
  }

  handleOpen(event) {
    event.preventDefault();
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  }

  handleOnRequest(version) {
    this.setState({
      open: false,
    });
    this.props.handleSelect(version);
  }

  render() {
    const { open, anchorEl } = this.state;
    const { versions, buttonLabel, hide } = this.props;

    if (hide) return null;

    return (
      <div>
        <div
          style={{
            marginRight: 10,
            zIndex: 999,
            cursor: "pointer",
            fontSize: "1em",
            borderBottom: "1px dotted",
            padding: 0,
          }}
          onClick={this.handleOpen.bind(this)}
        >
          {buttonLabel}
        </div>
        <Menu
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
          targetOrigin={{ horizontal: "left", vertical: "top" }}
          onClose={() => this.setState({ open: false })}
        >
          {sortVersions(versions).map((version, i) => (
            <MenuItem
              key={"version" + i}
              onClick={() => this.handleOnRequest(version)}
              sx={{ fontSize: 12 }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: 10,
                }}
              >
                <div style={{ display: "flex", marginTop: 10 }}>
                  <div style={{ marginRight: 8, fontWeight: 600 }}>
                    {version.version}
                  </div>
                  <div>{version.name}</div>
                </div>
                <div style={{ marginTop: 10 }}>
                  {version.changedBy ? (
                    <span>
                      {version.changedBy}: {version.versionComment || ""}
                    </span>
                  ) : (
                    <span>{version.versionComment || ""}</span>
                  )}
                </div>
              </div>
              <hr />
              <div
                style={{ transform: "translateY(-19px)", textAlign: "right" }}
              >
                {`${version.fromDate || ""} - ${version.toDate || ""}`}
              </div>
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }
}

VersionsPopover.propTypes = {
  versions: PropTypes.arrayOf(PropTypes.object).isRequired,
  disabled: PropTypes.bool,
  handleSelect: PropTypes.func.isRequired,
  buttonLabel: PropTypes.string.isRequired,
};

export default injectIntl(VersionsPopover);
