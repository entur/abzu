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
import PropTypes from "prop-types";
import MdClose from "material-ui/svg-icons/navigation/close";
import IconButton from "material-ui/IconButton";

class DialogHeader extends Component {
  render() {
    const { title, handleClose } = this.props;

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 5,
        }}
      >
        <div
          style={{
            marginTop: 8,
            marginLeft: 10,
            fontWeight: 600,
          }}
        >
          {title}{" "}
        </div>
        <IconButton style={{ marginRight: 5 }} onClick={handleClose}>
          <MdClose />
        </IconButton>
      </div>
    );
  }
}

DialogHeader.propTypes = {
  title: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default DialogHeader;
