import MdLess from "@mui/icons-material/ExpandLess";
import MdMore from "@mui/icons-material/ExpandMore";
import FlatButton from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { ReactElement } from "react";
import { useIntl } from "react-intl";
import { AccessibilityLimitation as AccessibilityLimitationEnum } from "../../models/AccessibilityLimitation";
import { EntityType } from "../../models/Entities";
import { Facility as FacilityEnum } from "../../models/Facility";
import ToolTipIcon from "./ToolTipIcon";

interface Props {
  entityType: EntityType;
  name: AccessibilityLimitationEnum | FacilityEnum;
  item: ReactElement;
  relatedItems?: ReactElement;
  isExpanded?: boolean;
  handleExpand?: () => void;
  handleCollapse?: () => void;
}

const ErsadItem = ({
  name,
  entityType,
  isExpanded,
  handleExpand,
  handleCollapse,
  item,
  relatedItems,
}: Props) => {
  const { formatMessage } = useIntl();

  return (
    <div style={{ marginTop: 10 }}>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.8em",
          }}
        >
          {item}
          <ToolTipIcon
            title={formatMessage({ id: `${name}_${entityType}_hint` })}
          />
        </div>

        {isExpanded && relatedItems}

        {relatedItems && (
          <div style={{ textAlign: "center", marginBottom: 5 }}>
            {isExpanded ? (
              <FlatButton
                style={{ height: 20, minWidth: 20, width: 20 }}
                onClick={() => handleCollapse && handleCollapse()}
              >
                <MdLess style={{ height: 16, width: 16 }} />
              </FlatButton>
            ) : (
              <FlatButton
                style={{ height: 20, minWidth: 20, width: 20 }}
                onClick={() => handleExpand && handleExpand()}
              >
                <MdMore style={{ height: 16, width: 16 }} />
              </FlatButton>
            )}
          </div>
        )}
      </div>

      <Divider style={{ marginTop: 10, marginBottom: 10 }} />
    </div>
  );
};

export default ErsadItem;
