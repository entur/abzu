import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { UnknownAction } from "@reduxjs/toolkit";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { LocalServiceActions } from "../../../actions";
import { AssistanceAvailability as AssistanceAvailabilityEnum } from "../../../models/LocalServices";
import LocalServicesHelpers from "../../../modelUtils/localServicesHelpers";
import { getIn } from "../../../utils";
import { AssistanceProps } from "./types";

const AssistanceServiceDetails = ({
  entity,
  disabled,
  id,
}: AssistanceProps) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const inputName = "assistanceServiceAvailability";
  const isAssistanceServicePresent =
    LocalServicesHelpers.isAssistanceServicePresent(entity);
  const assistanceAvailability: AssistanceAvailabilityEnum = getIn(
    entity,
    ["localServices", "assistanceService", inputName],
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

  const assistanceAvailabilityOptions: AssistanceAvailabilityEnum[] = [
    AssistanceAvailabilityEnum.AVAILABLE,
    AssistanceAvailabilityEnum.AVAILABLE_IF_BOOKED,
    AssistanceAvailabilityEnum.AVAILABLE_AT_CERTAIN_TIMES,
    AssistanceAvailabilityEnum.UNKNOWN,
    AssistanceAvailabilityEnum.NONE,
  ];

  return (
    <FormControl variant="filled" fullWidth>
      <InputLabel id="demo-simple-select-label">
        {formatMessage({
          id: inputName,
        })}
      </InputLabel>
      <Select
        labelId={`${id}_${inputName}-select-label`}
        id={`${id}_${inputName}-select-input-id`}
        value={assistanceAvailability}
        label={formatMessage({
          id: `${inputName}_${assistanceAvailability}`,
        })}
        onChange={handleChange}
      >
        {(canBeEdited
          ? assistanceAvailabilityOptions
          : [AssistanceAvailabilityEnum.NONE]
        ).map((option) => {
          return (
            <MenuItem
              key={`${id}_${inputName}-option-${option}`}
              value={option}
            >
              {formatMessage({ id: `${inputName}_${option}` })}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default AssistanceServiceDetails;
