import {
  AssistanceFacility,
  defaultLocalServices,
  LocalService,
} from "../models/LocalServices";
import { getIn } from "../utils";

const LocalServicesHelpers = {};

LocalServicesHelpers.getAssistanceService = (entity) => {
  return getIn(entity, ["localServices", "assistanceService"], {});
};

LocalServicesHelpers.isAssistanceServicePresent = (entity) => {
  const assistanceFacilityList = getIn(
    entity,
    ["localServices", "assistanceService", "assistanceFacilityList"],
    null,
  );
  return (
    assistanceFacilityList &&
    !(
      assistanceFacilityList.length === 1 &&
      assistanceFacilityList[0] === AssistanceFacility.NONE
    )
  );
};

LocalServicesHelpers.updateAssistanceServiceState = (stopPlace, payload) => {
  let updatedStop = JSON.parse(JSON.stringify(stopPlace));
  return updateLocalServiceForEntity(
    updatedStop,
    payload,
    LocalService.ASSISTANCE_SERVICE,
  );
};

const updateLocalServiceForEntity = (entity, payload, typeOfService) => {
  const { state } = payload;

  let stateFromCheckbox = typeof state === "boolean";

  let overrideState;

  if (stateFromCheckbox) {
    if (state) {
      overrideState = defaultLocalServices[typeOfService].isChecked;
    } else {
      overrideState = defaultLocalServices[typeOfService].isUnChecked;
    }
  } else {
    overrideState = state;
  }

  if (!entity.localServices) {
    entity.localServices = {};
  }

  entity.localServices[typeOfService] = overrideState;

  return entity;
};

/*
 * Simplify place equipment before sending it to the GraphQL API
 * Please note that the GraphQL API is not strictly Netex, so the method name is misleading.
 * This method removes id fields from place equipments, as this is not supported by the GraphQL APIs input type. (ROR-467)
 */
export const netexifyLocalServices = (localServices) => {
  if (localServices) {
    let netexRepresentation = {};

    Object.keys(localServices).forEach((key) => {
      if (localServices[key] && key !== "id") {
        netexRepresentation[key] = [localServices[key]];

        // Do not send ID as the Graphql API Input type does not accept this.
        if (
          Array.isArray(netexRepresentation[key]) &&
          netexRepresentation[key].length > 0
        ) {
          delete netexRepresentation[key][0].id;
        }
      }
    });

    return netexRepresentation;
  }
  return null;
};

export default LocalServicesHelpers;
