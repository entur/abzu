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

import Divider from "@mui/material/Divider";
import PropTypes from "prop-types";
import { Component } from "react";
import { injectIntl } from "react-intl";
import Code from "../EditStopPage/Code";
import CopyIdButton from "../Shared/CopyIdButton";

class StopPlaceListItemQuayItem extends Component {
  render() {
    const { quay } = this.props;
    const { formatMessage } = this.props.intl;
    const defaultValue = formatMessage({ id: "not_assigned" });

    return (
      <div>
        <Divider />
        <div style={{ display: "flex", alignItems: "center", padding: 8 }}>
          <Code
            type="publicCode"
            value={quay.publicCode}
            defaultValue={defaultValue}
          />
          <Code
            type="privateCode"
            value={quay.privateCode}
            defaultValue={defaultValue}
          />
          <div style={{ display: "flex", alignItems: "center", marginLeft: 5 }}>
            <div style={{ fontSize: "0.7em" }}>
              {quay.id}
              <CopyIdButton idToCopy={quay.id} />
            </div>
          </div>
        </div>
        <Divider />
      </div>
    );
  }
}

StopPlaceListItemQuayItem.propTypes = {
  quay: PropTypes.object.isRequired,
};

export default injectIntl(StopPlaceListItemQuayItem);
