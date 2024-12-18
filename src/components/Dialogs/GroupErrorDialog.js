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
import { Component } from "react";
import { injectIntl } from "react-intl";

class GroupErrorDialog extends Component {
  getErrorText(type, formatMessage) {
    if (type === "NOT_FOUND") {
      return formatMessage({ id: "group_not_found" });
    } else {
      return formatMessage({ id: "error_unable_to_load_stop" });
    }
  }

  render() {
    const { errorType, open, intl, handleOK } = this.props;
    const { formatMessage } = intl;
    const errorText = this.getErrorText(errorType, formatMessage);

    return (
      <Dialog open={open}>
        <DialogTitle>{formatMessage({ id: "error_has_occurred" })}</DialogTitle>
        <DialogContent>{errorText}</DialogContent>
        <DialogActions>
          <Button variant="text" onClick={handleOK}>
            {formatMessage({ id: "ok" })}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default injectIntl(GroupErrorDialog);
