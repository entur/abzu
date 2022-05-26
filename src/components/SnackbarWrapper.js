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

import React, { Component } from "react";
import { connect } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import * as types from "../actions/Types";
import MdCheck from "@mui/icons-material/Check";
import MdError from "@mui/icons-material/Error";
import { UserActions } from "../actions/";
import Button from '@mui/material/Button';
import MdInfo from "@mui/icons-material/InfoOutlined";

class SnackbarWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  handleRequestClose() {
    this.props.dispatch(UserActions.dismissSnackbar());
  }

  getAlertIcon(status) {
    if (status === types.SUCCESS) {
      return (
        <MdCheck style={{ fill: "#088f17", color: "#fff", marginRight: 10 }} />
      );
    } else if (status === types.ERROR) {
      return (
        <MdError style={{ fill: "#cc0000", color: "#fff", marginRight: 10 }} />
      );
    } else {
      return null;
    }
  }

  render() {
    const { snackbarOptions, formatMessage } = this.props;
    const { isOpen, status, errorMsg } = snackbarOptions;
    const { expanded } = this.state;
    const autoHideDuration = status === types.SUCCESS ? 3000 : 0;
    const isError = status === types.ERROR;
    const message = formatMessage({
      id: isError ? "snackbar_message_failed" : "snackbar_message_saved",
    });
    const showExpanded = expanded && isError;
    const notAssigned = formatMessage({ id: "not_assigned" });

    return (
      <Snackbar
        open={isOpen}
        message={
          <div>
            {showExpanded && (
              <div
                style={{
                  color: "#fff",
                  lineHeight: 1.5,
                  padding: 5,
                  border: "1px dotted #fff",
                  marginTop: 8,
                  minHeight: 85,
                }}
              >
                {errorMsg || notAssigned}
              </div>
            )}
            <div
              style={{
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: isError ? "space-between" : "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                {this.getAlertIcon(status)}
                {message}
              </div>
              {isError && (
                <Button
                  variant="text"
                  icon={
                    <MdInfo
                      style={{ fill: "#fff" }}
                      onClick={() => {
                        this.setState({ expanded: !expanded });
                      }}
                    />
                  }
                />
              )}
            </div>
          </div>
        }
        autoHideDuration={autoHideDuration}
        onClose={this.handleRequestClose.bind(this)}
      />
    );
  }
}

const mapStateToProps = ({ snackbar }) => ({
  snackbarOptions: snackbar.snackbarOptions,
});

export default connect(mapStateToProps)(SnackbarWrapper);
