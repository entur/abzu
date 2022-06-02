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
import Spinner from "../../static/icons/spinner";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
} from "@mui/material";
import { Cancel, Delete, Warning } from "@mui/icons-material";

class RemoveStopFromParentDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      changesUnderstood: false,
    };
  }

  static propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func.isRequired,
    handleConfirm: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  getConfirmDisabled() {
    const { changesUnderstood, isLoading } = this.state;

    if (isLoading) return true;

    const { isLastChild } = this.props;
    if (isLastChild) {
      if (changesUnderstood) {
        return false;
      }
      return true;
    }
    return false;
  }

  render() {
    const {
      open = false,
      intl,
      handleClose,
      handleConfirm,
      stopPlaceId,
      isLastChild,
      isLoading,
    } = this.props;
    const { formatMessage } = intl;

    const translations = {
      confirm: formatMessage({ id: "confirm" }),
      cancel: formatMessage({ id: "cancel" }),
      title: formatMessage({ id: "remove_stop_from_parent_title" }),
      info: formatMessage({ id: "remove_stop_from_parent_info" }),
      understood: formatMessage({ id: "changes_understood" }),
      lastChildWarning1: formatMessage({ id: "last_child_warning_first" }),
      lastChildWarning2: formatMessage({ id: "last_child_warning_second" }),
    };

    const { changesUnderstood } = this.state;
    const confirmDisabled = this.getConfirmDisabled();

    return (
      <Dialog
        open={open}
        onClose={() => {
          handleClose();
        }}
      >
        <DialogTitle>{translations.title}</DialogTitle>
        <DialogContent>
          <div>
            <div style={{ marginBottom: 10, color: "#000" }}>
              <span style={{ fontWeight: 600 }}>{stopPlaceId}</span>
            </div>
            <div style={{ marginLeft: 0, display: "flex" }}>
              <div style={{ marginTop: 0, marginRight: 5 }}>
                <Warning color="orange" />
              </div>
              <span>{translations.info}</span>
            </div>
            {isLastChild && (
              <div style={{ marginTop: 10 }}>
                <div style={{ marginLeft: 0, display: "flex" }}>
                  <div style={{ marginTop: 0, marginRight: 5 }}>
                    <Warning color="#de3e35" />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span>{translations.lastChildWarning1}</span>
                    <span style={{ marginTop: 5 }}>
                      {translations.lastChildWarning2}
                    </span>
                  </div>
                </div>
                <FormControlLabel
                  control={
                    <Checkbox
                      style={{ marginLeft: 25, marginTop: 5 }}
                      onChange={(e, v) =>
                        this.setState({ changesUnderstood: v })
                      }
                      checked={changesUnderstood}
                    />
                  }
                  label={translations.understood}
                />
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="text"
            onClick={handleClose}
            startIcon={<Cancel />}
            color="secondary"
          >
            {translations.cancel}
          </Button>
          <Button
            variant="text"
            onClick={handleConfirm}
            disabled={confirmDisabled}
            startIcon={isLoading ? <Spinner /> : <Delete />}
          >
            {translations.confirm}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default RemoveStopFromParentDialog;
