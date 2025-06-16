import Divider from "@mui/material/Divider";
import React from "react";
import { useIntl } from "react-intl";
import ToolTipIcon from "../ToolTipIcon";

interface Props {
  children: React.ReactNode;
  tooltipTitle: string;
}

const AccessibilityLimitation = ({ children, tooltipTitle }: Props) => {
  const { formatMessage } = useIntl();

  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {children}
        <ToolTipIcon title={formatMessage({ id: tooltipTitle })} />
      </div>
      <Divider style={{ marginTop: 10, marginBottom: 10 }} />
    </div>
  );
};

export default AccessibilityLimitation;
