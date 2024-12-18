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

import Checkbox from "@mui/material/Checkbox";
import React from "react";
import Code from "../EditStopPage/Code";

class ScrollableQuayItem extends React.Component {
  render() {
    const { quay, checked, handleCheck } = this.props;

    return (
      <div style={{ display: "flex", alignItems: "center", margin: 10 }}>
        <Checkbox
          style={{ width: 10 }}
          checked={checked}
          onCheck={(e, value) => handleCheck(value, quay.id)}
        />
        <Code type="publicCode" value={quay.publicCode} />
        <Code type="privateCode" value={quay.privateCode} />
        <span style={{ marginLeft: 10 }}>{quay.id}</span>
        <span style={{ marginLeft: 10 }}>{quay.description}</span>
      </div>
    );
  }
}

export default ScrollableQuayItem;
