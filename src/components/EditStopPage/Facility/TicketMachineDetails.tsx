import TextField from "@mui/material/TextField";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { AnyAction } from "redux";
import { EquipmentActions } from "../../../actions";
import EquipmentHelpers from "../../../modelUtils/equipmentHelpers";
import { getIn } from "../../../utils";
import { FacilityProps } from "./types";

const TicketMachineDetails = ({
  index,
  id,
  entity,
  disabled,
  entityType,
}: FacilityProps) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const ticketMachineNumber = getIn(
    entity,
    ["placeEquipments", "ticketingEquipment", "numberOfMachines"],
    0,
  );

  const handleValueForTicketMachineChange = (numberOfMachines: number) => {
    if (disabled) {
      return;
    }
    if (numberOfMachines < 0) {
      numberOfMachines = 0;
    }

    const ticketingEquipment = EquipmentHelpers.getTicketingEquipment(entity);

    dispatch(
      EquipmentActions.updateTicketMachineState(
        {
          ...ticketingEquipment,
          numberOfMachines,
          ticketMachines: numberOfMachines > 0,
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
          handleValueForTicketMachineChange(
            event.target.value as unknown as number,
          )
        }
      />
    </div>
  );
};

export default TicketMachineDetails;
