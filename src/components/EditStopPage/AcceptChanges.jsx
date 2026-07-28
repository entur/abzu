import WarningIcon from "@mui/icons-material/Warning";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import React from "react";
import { injectIntl } from "react-intl";
import { getPrimaryColor } from "../../config/themeConfig";

class AcceptChanges extends React.Component {
  render() {
    const { checked, onChange, intl } = this.props;
    const infoLabel = intl.formatMessage({ id: "accept_changes_info" });
    const checkboxLabel = intl.formatMessage({ id: "accept_changes" });
    const primary = getPrimaryColor();

    return (
      <div
        style={{
          border: "1px solid",
          borderColor: checked ? primary : "#de3e35",
          padding: 10,
          marginTop: 10,
        }}
      >
        <div style={{ marginTop: 10, display: "flex", alignItems: "center" }}>
          <WarningIcon sx={{ color: "orange" }} />
          <span style={{ fontWeight: 600, marginLeft: 5 }}>{infoLabel}</span>
        </div>
        <FormControlLabel
          sx={{ marginLeft: 3, width: "80%", padding: 1 }}
          control={<Checkbox checked={checked} onChange={onChange} />}
          label={checkboxLabel}
        />
      </div>
    );
  }
}

export default injectIntl(AcceptChanges);
