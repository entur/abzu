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

import Warning from "@mui/icons-material/Warning";
import Tooltip from "@mui/material/Tooltip";
import { Component } from "react";
import { injectIntl } from "react-intl";

class HasExpiredInfo extends Component {
  render() {
    const { show, intl } = this.props;
    const { formatMessage } = intl;

    if (!show) return null;

    return (
      <Tooltip
        title={formatMessage({ id: "stop_has_expired_last_version" })}
        arrow
      >
        <Warning color="warning" style={{ marginTop: -5, cursor: "pointer" }} />
      </Tooltip>
    );
  }
}

export default injectIntl(HasExpiredInfo);
