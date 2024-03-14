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
import Divider from "@mui/material/Divider";
import ModalityIcon from "../MainPage/ModalityIconSvg";
import StopPlaceLink from "../ReportPage/StopPlaceLink";

class StopPlaceListChildItem extends Component {
  render() {
    const { child } = this.props;

    return (
      <div>
        <Divider />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: 8,
            justifyContent: "space-between",
          }}
        >
          <ModalityIcon
            type={child.stopPlaceType}
            submode={child.submode}
            svgStyle={{ transform: "scale(0.8)" }}
            style={{ marginTop: -8, marginRight: 5, marginLeft: -5, flex: 1 }}
          />
          <div style={{ fontSize: "0.8em", marginRight: 5, flex: 2 }}>
            {child.name}
          </div>
          <StopPlaceLink
            style={{ fontSize: "0.8em", marginRight: 5, flex: 2 }}
            id={child.id}
          />
        </div>
        <Divider />
      </div>
    );
  }
}

export default StopPlaceListChildItem;
