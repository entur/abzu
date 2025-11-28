import TouchAppIcon from "@mui/icons-material/TouchApp";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import TextField from "@mui/material/TextField";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { AnyAction } from "redux";
import { EquipmentActions } from "../../../actions";
import EquipmentHelpers from "../../../modelUtils/equipmentHelpers";
import { getIn } from "../../../utils";
import FeatureCheckbox from "../PlaceFeatures/FeatureCheckbox";
import {
  FacilityTabItemDetail as FacilityDetailEnum,
  FacilityTabItemProps,
  TicketMachineDetailFields,
} from "./types";

const TicketMachineDetails = ({
  index,
  id,
  entity,
  disabled,
  entityType,
}: FacilityTabItemProps) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const ticketingEquipmentKeys = ["placeEquipments", "ticketingEquipment"];

  const ticketMachineNumber = getIn(
    entity,
    ticketingEquipmentKeys.concat(FacilityDetailEnum.NUMBER_OF_MACHINES),
    0,
  );
  const audioInterfaceAvailable = getIn(
    entity,
    ticketingEquipmentKeys.concat(FacilityDetailEnum.AUDIO_INTERFACE_AVAILABLE),
    false,
  );
  const tactileInterfaceAvailable = getIn(
    entity,
    ticketingEquipmentKeys.concat(
      FacilityDetailEnum.TACTILE_INTERFACE_AVAILABLE,
    ),
    false,
  );

  const handleValueForTicketMachineChange = (
    newValue: TicketMachineDetailFields,
  ) => {
    if (disabled) {
      return;
    }
    if ((newValue.numberOfMachines as number) < 0) {
      newValue.numberOfMachines = 0;
    }

    const ticketingEquipment = EquipmentHelpers.getTicketingEquipment(entity);
    const updatedTicketingEquipment = {
      ...ticketingEquipment,
      ...newValue,
    };

    if (!updatedTicketingEquipment.ticketMachines) {
      updatedTicketingEquipment.ticketMachines =
        ((newValue.numberOfMachines as number) ||
          ticketingEquipment.numberOfMachines) > 0 ||
        updatedTicketingEquipment.audioInterfaceAvailable ||
        updatedTicketingEquipment.tactileInterfaceAvailable;
    }

    if (
      updatedTicketingEquipment.ticketMachines &&
      !updatedTicketingEquipment.numberOfMachines
    ) {
      updatedTicketingEquipment.numberOfMachines = 1;
    }

    dispatch(
      EquipmentActions.updateTicketMachineState(
        {
          ...updatedTicketingEquipment,
        },
        entityType,
        id || index,
      ) as unknown as AnyAction,
    );
  };

  return (
    <div>
      <TextField
        label={formatMessage({ id: "number_of_ticket_machines" })}
        type="number"
        variant="filled"
        value={ticketMachineNumber}
        disabled={disabled}
        fullWidth={true}
        onChange={(event) =>
          handleValueForTicketMachineChange({
            numberOfMachines: event.target.value as unknown as number,
          })
        }
      />
      <div style={{ display: "block" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <FeatureCheckbox
            icon={<VolumeUpIcon />}
            handleFeatureStateChange={(value: boolean) =>
              handleValueForTicketMachineChange({
                audioInterfaceAvailable: value,
              })
            }
            name={FacilityDetailEnum.AUDIO_INTERFACE_AVAILABLE}
            isFeaturePresent={audioInterfaceAvailable}
          />
          <FeatureCheckbox
            icon={<TouchAppIcon />}
            handleFeatureStateChange={(value: boolean) =>
              handleValueForTicketMachineChange({
                tactileInterfaceAvailable: value,
              })
            }
            name={FacilityDetailEnum.TACTILE_INTERFACE_AVAILABLE}
            isFeaturePresent={tactileInterfaceAvailable}
          />
        </div>
      </div>
    </div>
  );
};

export default TicketMachineDetails;
