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
} from "@mui/material";
import React, { Component } from "react";
import { injectIntl } from "react-intl";

class SaveGroupDialog extends Component {
  render() {
    const { open, handleClose, handleSave, intl } = this.props;
    const { formatMessage } = intl;

    return (
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>
          {formatMessage({ id: "save_group_of_stop_places" })}
        </DialogTitle>
        <DialogContent>
          <p>
            {formatMessage({ id: "are_you_sure_save_group_of_stop_places" })}
          </p>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={handleClose} color="secondary">
            {formatMessage({ id: "cancel" })}
          </Button>
          <Button variant="text" onClick={handleSave}>
            {formatMessage({ id: "save" })}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default injectIntl(SaveGroupDialog);
