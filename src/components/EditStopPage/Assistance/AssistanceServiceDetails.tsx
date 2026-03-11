import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { UnknownAction } from "@reduxjs/toolkit";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { LocalServiceActions } from "../../../actions";
import { AssistanceAvailability } from "../../../models/LocalServices";
import LocalServicesHelpers from "../../../modelUtils/localServicesHelpers";
import { getIn } from "../../../utils";
import { AssistanceTabItemDetail, AssistanceTabItemProps } from "./types";

const AssistanceServiceDetails = ({
  entity,
  disabled,
  id,
}: AssistanceTabItemProps) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const isAssistanceServicePresent =
    LocalServicesHelpers.isAssistanceServicePresent(entity);
  const assistanceAvailability: AssistanceAvailability = getIn(
    entity,
    ["localServices", "assistanceService", "assistanceAvailability"],
    null,
  );
  const canBeEdited = !disabled && isAssistanceServicePresent;

  const handleChange = (event: any) => {
    if (!canBeEdited) {
      return;
    }

    dispatch(
      LocalServiceActions.updateAssistanceServiceAvailability(
        {
          ...LocalServicesHelpers.getAssistanceService(entity),
          assistanceAvailability: event.target.value,
        },
        id,
      ) as unknown as UnknownAction,
    );
  };

  const assistanceAvailabilityOptions: AssistanceAvailability[] = [
    AssistanceAvailability.AVAILABLE,
    AssistanceAvailability.AVAILABLE_IF_BOOKED,
    AssistanceAvailability.AVAILABLE_AT_CERTAIN_TIMES,
    AssistanceAvailability.UNKNOWN,
    AssistanceAvailability.NONE,
  ];

  return (
    <FormControl variant="filled" fullWidth>
      <InputLabel id="demo-simple-select-label">
        {formatMessage({
          id: AssistanceTabItemDetail.ASSISTANCE_AVAILABILITY,
        })}
      </InputLabel>
      <Select
        labelId={`${id}_${AssistanceTabItemDetail.ASSISTANCE_AVAILABILITY}-select-label`}
        id={`${id}_${AssistanceTabItemDetail.ASSISTANCE_AVAILABILITY}-select-input-id`}
        value={assistanceAvailability}
        label={formatMessage({
          id: `${AssistanceTabItemDetail.ASSISTANCE_AVAILABILITY}_${assistanceAvailability}`,
        })}
        onChange={handleChange}
        disabled={!canBeEdited}
      >
        {assistanceAvailabilityOptions.map((option) => (
          <MenuItem key={`${id}_${AssistanceTabItemDetail.ASSISTANCE_AVAILABILITY}-option-${option}`} value={option}>
            {formatMessage({ id: `${AssistanceTabItemDetail.ASSISTANCE_AVAILABILITY}_${option}` })}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default AssistanceServiceDetails;
