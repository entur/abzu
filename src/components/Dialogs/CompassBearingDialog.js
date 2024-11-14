import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import CompassBearingSelector from "./CompassBearingSelector";

class CompassBearingDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorText: "",
      enableSave: false,
      compassBearing: props.compassBearing || 0, // Initialize with a valid default bearing
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.setCompassBearing = this.setCompassBearing.bind(this);
  }

  static propTypes = {
    open: PropTypes.bool.isRequired,
    intl: PropTypes.object.isRequired,
    compassBearing: PropTypes.number,
    handleConfirm: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
  };

  handleInputChange(event) {
    const compassBearing = event.target.value;
    this.validateInput(compassBearing);
    this.setState({
      compassBearing,
    });
  }

  handleClose() {
    this.setState({
      compassBearing: this.props.compassBearing,
      errorText: "",
    });
    this.props.handleClose();
  }

  handleConfirm() {
    const { compassBearing } = this.state;

    if (typeof compassBearing === "undefined" || isNaN(compassBearing)) {
      this.setState({
        errorText: this.props.intl.formatMessage({
          id: "change_compass_bearing_invalid",
        }),
      });
      return;
    }

    this.props.handleConfirm(Number(compassBearing));

    /**this.setState({
      compassBearing: null,
      errorText: "",
    });**/
  }

  setCompassBearing(bearing) {
    this.validateInput(bearing);
    this.setState({
      compassBearing: bearing,
    });
  }

  validateInput(compassBearing) {
    let errorText = "";
    let enableSave = true;

    if (isNaN(compassBearing) || compassBearing < 0 || compassBearing > 360) {
      errorText = this.props.intl.formatMessage({
        id: "change_compass_bearing_invalid",
      });
      enableSave = false;
    }

    this.setState({
      errorText,
      enableSave,
    });
  }

  render() {
    const { open, intl } = this.props;
    const { formatMessage } = intl;
    const { compassBearing, errorText, enableSave } = this.state;

    const compassBearingTranslation = {
      title: formatMessage({ id: "change_compass_bearing" }),
      body: formatMessage({ id: "change_compass_bearing_help_text" }),
      confirm: formatMessage({ id: "change_compass_bearing_confirm" }),
      cancel: formatMessage({ id: "change_compass_bearing_cancel" }),
    };

    return (
      <Dialog open={open}>
        <DialogTitle>{compassBearingTranslation.title}</DialogTitle>
        <DialogContent sx={{ alignContent: "center" }}>
          {compassBearingTranslation.body}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <TextField
              label={formatMessage({ id: "compass_bearing" })}
              variant="standard"
              value={compassBearing}
              onChange={this.handleInputChange}
              error={Boolean(errorText)}
              helperText={errorText}
              InputLabelProps={{
                shrink: true, // Force the label to always shrink, avoiding overlap
              }}
            />

            <CompassBearingSelector
              bearing={compassBearing}
              onBearingChange={this.setCompassBearing}
            />
          </div>
        </DialogContent>

        <DialogActions>
          <Button
            variant="text"
            onClick={this.handleClose}
            style={{ marginRight: 5 }}
            color="secondary"
          >
            {compassBearingTranslation.cancel}
          </Button>
          <Button
            variant="text"
            disabled={!enableSave}
            onClick={this.handleConfirm}
          >
            {compassBearingTranslation.confirm}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default CompassBearingDialog;
