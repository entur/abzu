import StopPlace from "../../../models/StopPlace";

export enum AssistanceTabItem {
  ASSISTANCE_SERVICE = "assistanceService",
}

/**
 * Re-used between all services, whether on stop place or quay level;
 * id is relevant for a stop place, while index is for quay
 */
export interface AssistanceTabItemProps {
  entity: StopPlace;
  disabled: boolean;
  id?: string;
}
