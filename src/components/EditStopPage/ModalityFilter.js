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
import ModalityIconSvg from "../MainPage/ModalityIconSvg";
import stopTypes from "../../models/stopTypes";
import Checkbox from "@mui/material/Checkbox";

class ModalityFilter extends React.Component {
  handleOnCheck(checked, value) {
    const { stopTypeFilter } = this.props;
    let newFilters = stopTypeFilter.slice();

    if (checked) {
      newFilters.push(value);
      // i.e. no filters: all modalities are selected
      if (newFilters.length === Object.keys(stopTypes).length) {
        newFilters = [];
      }
    } else {
      if (!newFilters.length) {
        // if no filters are applied, onChange should select this
        newFilters.push(value);
      } else {
        const index = newFilters.indexOf(value);
        if (index > -1) {
          newFilters.splice(index, 1);
        }
      }
    }
    this.props.handleApplyFilters(newFilters);
  }

  render() {
    const { stopTypeFilter } = this.props;

    const wrapperStyle = {
      display: "flex",
      padding: 8,
      justifyContent: "space-between",
    };

    return (
      <div style={wrapperStyle}>
        {Object.keys(stopTypes).map((item) => {
          const checked =
            stopTypeFilter.indexOf(item) > -1 || !stopTypeFilter.length;

          return (
            <div key={"item-" + item}>
              <Checkbox
                checkedIcon={
                  <ModalityIconSvg
                    svgStyle={{ height: 20, width: 20 }}
                    //style={{ color: "black" }}
                    type={item}
                    forceUpdate={true}
                  />
                }
                icon={
                  <ModalityIconSvg
                    svgStyle={{ height: 20, width: 20 }}
                    style={{ opacity: "0.3" }}
                    type={item}
                    forceUpdate={true}
                  />
                }
                style={{ width: "auto" }}
                checked={checked}
                onChange={(e, v) => {
                  this.handleOnCheck(v, item);
                }}
              />
            </div>
          );
        })}
      </div>
    );
  }
}

export default ModalityFilter;
