import React from "react";
import { styled } from "@mui/material/styles";
import { injectIntl } from "react-intl";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Select from "@mui/material/Select";

import stopTypes from "../../models/stopTypes";
import ModalityIconSvg from "../MainPage/ModalityIconSvg";

const PREFIX = "StopTypeFilter";

const classes = {
  formControl: `${PREFIX}-formControl`,
  chips: `${PREFIX}-chips`,
  chip: `${PREFIX}-chip`,
  noLabel: `${PREFIX}-noLabel`,
};

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  [`&.${classes.formControl}`]: {
    //margin: theme.spacing(1),
    minWidth: 300,
    maxWidth: 500,
  },

  [`& .${classes.chips}`]: {
    display: "flex",
    flexWrap: "wrap",
  },

  [`& .${classes.chip}`]: {
    margin: 2,
  },

  [`& .${classes.noLabel}`]: {
    marginTop: theme.spacing(3),
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const StopTypeFilter = ({ intl: { formatMessage }, value, onChange }) => {
  const modalities = Object.keys(stopTypes);

  return (
    <StyledFormControl className={classes.formControl} variant="standard">
      <InputLabel id="modality-filter-label">Modality filter</InputLabel>
      <Select
        id="modality-filter"
        multiple
        value={value}
        renderValue={(value) =>
          value
            .map((mode) => formatMessage({ id: `stopTypes.${mode}.name` }))
            .join(", ")
        }
        onChange={(e) => onChange(e.target.value)}
        input={<Input />}
        MenuProps={MenuProps}
        variant="standard"
      >
        {modalities.map((mode) => (
          <MenuItem key={mode} value={mode}>
            <ListItemIcon>
              <ModalityIconSvg
                svgStyle={{ height: 20, width: 20 }}
                type={mode}
                forceUpdate={true}
              />
            </ListItemIcon>
            <ListItemText>
              {formatMessage({ id: `stopTypes.${mode}.name` })}
            </ListItemText>
          </MenuItem>
        ))}
      </Select>
    </StyledFormControl>
  );
};

export default injectIntl(StopTypeFilter);
