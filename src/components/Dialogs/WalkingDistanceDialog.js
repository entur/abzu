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

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

class WalkingDistanceDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorText: "",
    };
  }

  static propTypes = {
    open: PropTypes.bool.isRequired,
    intl: PropTypes.object.isRequired,
    estimate: PropTypes.number,
    handleConfirm: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
  };

  handleInputChange(event, newValue) {
    this.setState({
      estimate: newValue,
    });
  }

  handleClose() {
    this.setState({
      estimate: null,
      errorText: "",
    });
    this.props.handleClose();
  }

  handleConfirm() {
    const { estimate } = this.state;
    const { index } = this.props;

    if (typeof estimate === "undefined") return;

    if (!isNaN(estimate)) {
      this.props.handleConfirm(index, Number(estimate));

      this.setState({
        estimate: 0,
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

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      estimate: nextProps.estimate,
      errorText: "",
    });
  }

  render() {
    const { open, intl } = this.props;
    const { formatMessage } = intl;
    const { estimate } = this.state;

    const translation = {
      title: formatMessage({ id: "change_walking_distance_estimate" }),
      body: formatMessage({ id: "change_walking_distance_help_text" }),
      confirm: formatMessage({ id: "change_walking_distance_confirm" }),
      cancel: formatMessage({ id: "change_walking_distance_cancel" }),
    };

    return (
      <div>
        <Dialog open={open}>
          <DialogTitle>{translation.title}</DialogTitle>
          <DialogContent>
            {translation.body}
            <TextField
              hintText={formatMessage({ id: "seconds" })}
              label={formatMessage({ id: "seconds" })}
              floatingLabelStyle={{ textTransform: "capitalize" }}
              style={{ display: "block", margin: "auto", width: "90%" }}
              value={estimate}
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
              {translation.cancel}
            </Button>
            <Button variant="text" onClick={() => this.handleConfirm()}>
              {translation.confirm}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default WalkingDistanceDialog;
