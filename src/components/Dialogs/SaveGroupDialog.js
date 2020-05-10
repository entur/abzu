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
import Dialog from "material-ui/Dialog";
import { injectIntl } from "react-intl";
import FlatButton from "material-ui/FlatButton";

class SaveGroupDialog extends Component {
  render() {
    const { open, handleClose, handleSave, intl } = this.props;
    const { formatMessage } = intl;

    const actions = [
      <FlatButton
        label={formatMessage({ id: "cancel" })}
        onClick={handleClose}
      />,
      <FlatButton
        onClick={handleSave}
        label={formatMessage({ id: "save" })}
        primary={true}
      />,
    ];

    return (
      <Dialog
        onRequestClose={handleClose}
        open={open}
        actions={actions}
        title={formatMessage({ id: "save_group_of_stop_places" })}
      >
        <p>{formatMessage({ id: "are_you_sure_save_group_of_stop_places" })}</p>
      </Dialog>
    );
  }
}

export default injectIntl(SaveGroupDialog);
