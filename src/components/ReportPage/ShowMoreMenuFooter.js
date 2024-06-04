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
import FlatButton from "@mui/material/Button";
import Typography from "@mui/material/Typography";

class ShowMoreMenuFooter extends Component {
  render() {
    const { showMore, onClick, formatMessage } = this.props;
    const style = {
      textAlign: "center",
      padding: 5,
      background: "#fff",
      border: "1px solid #eee",
      textTransform: "uppercase",
    };

    const labelStyle = {
      fontWeight: 600,
      fontSize: "0.8em",
      color: "#333",
      textDecoration: "underline",
    };

    const label = showMore
      ? formatMessage({ id: "show_less" })
      : formatMessage({ id: "show_more" });

    return (
      <div style={style}>
        <FlatButton onClick={onClick}>
          <Typography sx={{ fontSize: "0.9em" }}>{label}</Typography>
        </FlatButton>
      </div>
    );
  }
}

export default ShowMoreMenuFooter;
