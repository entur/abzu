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
import MenuItem from "@mui/material/MenuItem";
import MdTransfer from "@mui/icons-material/TransferWithinAStation";
import weightTypes, { weightColors } from "../../models/weightTypes";
import { injectIntl } from "react-intl";
import { Popover } from "@mui/material";
class WeightingPopover extends React.Component {
  render() {
    const {
      handleClose,
      handleChange,
      open,
      anchorEl,
      intl: { formatMessage },
    } = this.props;

    return (
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        animated={true}
      >
        {weightTypes.map((type, index) => (
          <MenuItem
            key={"weightType" + index}
            value={type}
            style={{ padding: "0px 10px" }}
            primaryText={formatMessage({ id: `weightTypes.${type}` })}
            onClick={() => {
              handleChange(type);
            }}
            leftIcon={<MdTransfer color={weightColors[type] || "grey"} />}
          />
        ))}
      </Popover>
    );
  }
}

export default injectIntl(WeightingPopover);
