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
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { TextField } from "material-ui";

class CompassBearingDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorText: "",
    };
  }

  static propTypes = {
    open: PropTypes.bool.isRequired,
    intl: PropTypes.object.isRequired,
    compassBearing: PropTypes.number,
    handleConfirm: PropTypes.func.isRequired,
  };

  handleInputChange(event, compassBearing) {
    this.setState({
      compassBearing,
    });
  }

  handleClose() {
    this.setState({
      compassBearing: null,
      errorText: "",
    });
    this.props.handleClose();
  }

  handleConfirm() {
    const compassBearing = this.state
      ? this.state.compassBearing
      : this.props.compassBearing;

    if (typeof compassBearing === "undefined") return;

    if (!isNaN(compassBearing)) {
      this.props.handleConfirm(Number(compassBearing));

      this.setState({
        compassBearing: null,
        errorText: "",
      });
    } else {
      this.setState({
        errorText: this.props.intl.formatMessage({
          id: "change_compass_bearing_invalid",
        }),
      });
    }
  }

  render() {
    const { open, intl } = this.props;
    const { formatMessage } = intl;
    const compassBearing =
      this.state.compassBearing !== null
        ? this.state.compassBearing
        : this.props.compassBearing;

    const compassBearingTranslation = {
      title: formatMessage({ id: "change_compass_bearing" }),
      body: formatMessage({ id: "change_compass_bearing_help_text" }),
      confirm: formatMessage({ id: "change_compass_bearing_confirm" }),
      cancel: formatMessage({ id: "change_compass_bearing_cancel" }),
    };

    return (
      <div>
        <Dialog open={open}>
          <DialogTitle>{compassBearingTranslation.title}</DialogTitle>
          <DialogContent>
            {compassBearingTranslation.body}

            <TextField
              floatingLabelText={formatMessage({ id: "compass_bearing" })}
              style={{ display: "block", margin: "auto", width: "90%" }}
              value={compassBearing}
              onChange={this.handleInputChange.bind(this)}
              errorText={this.state.errorText}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="text"
              onClick={() => this.handleClose()}
              style={{ marginRight: 5 }}
              color="secondary"
            >
              {compassBearingTranslation.cancel}
            </Button>
            <Button
              variant="text"
              disabled={!this.state.compassBearing}
              onClick={() => this.handleConfirm()}
            >
              {compassBearingTranslation.confirm}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default CompassBearingDialog;
