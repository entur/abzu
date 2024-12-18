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

import Chip from "@mui/material/Chip";
import React from "react";

class TopographicalFilter extends React.Component {
  renderChip(data) {
    const isCounty = data.type === "county";
    const typeColor = isCounty ? "#73919b" : "#cde7eb";
    const typeTextColor = isCounty ? "#fff" : "#000";

    const chipStyle = {
      margin: 4,
      backgroundColor: typeColor,
      color: typeTextColor,
    };
    let id = data.id || data.value;

    return (
      <Chip
        key={id}
        onDelete={() => this.props.handleDeleteChip(id)}
        style={chipStyle}
        label={data.text}
      ></Chip>
    );
  }

  render() {
    const style = {
      display: "flex",
      flexWrap: "wrap",
      marginTop: 10,
      marginBottom: 10,
      width: "100%",
    };

    return (
      <div style={style}>
        {this.props.topoiChips.map(this.renderChip, this)}
      </div>
    );
  }
}

export default TopographicalFilter;
