import { useState } from "react";
import { EntityType } from "../../../models/Entities";
import PlaceFeatures from "../PlaceFeatures/PlaceFeatures";
import AssistanceService from "./AssistanceService";
import AssistanceServiceDetails from "./AssistanceServiceDetails";
import { AssistanceTabItem } from "./types";

interface Props {
  disabled: boolean;
  // TODO: StopPlace model needs to be reworked to have a proper type for this
  stopPlace: any;
}

/**
 * At the moment, contains contents of "localServices" field of a stop place,
 * but is meant to be more general, so that something outside "localServices"
 * also could be placed here if it fits in the meaning
 * @param disabled
 * @param stopPlace
 */
const AssistanceStopTab = ({ disabled, stopPlace }: Props) => {
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const entityType: EntityType = "stopPlace";

  return (
    <div style={{ padding: 10 }}>
      <PlaceFeatures
        name={AssistanceTabItem.ASSISTANCE_SERVICE}
        entityType={entityType}
        isExpanded={expandedIndex === 1}
        handleExpand={() => setExpandedIndex(1)}
        handleCollapse={() => setExpandedIndex(-1)}
        feature={
          <AssistanceService
            entity={stopPlace}
            disabled={disabled}
            id={stopPlace.id}
          />
        }
        relatedFeatures={
          <AssistanceServiceDetails
            entity={stopPlace}
            disabled={disabled}
            id={stopPlace.id}
          />
        }
      />
    </div>
  );
};

export default AssistanceStopTab;
