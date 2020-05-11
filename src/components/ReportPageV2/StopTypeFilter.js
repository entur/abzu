import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Select from "@material-ui/core/Select";

import stopTypes from "../../models/stopTypes";
import ModalityIconSvg from "../MainPage/ModalityIconSvg";

const useStyles = makeStyles((theme) => ({
  formControl: {
    //margin: theme.spacing(1),
    minWidth: 300,
    maxWidth: 500,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
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
  const classes = useStyles();
  const modalities = Object.keys(stopTypes);

  return (
    <FormControl className={classes.formControl}>
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
    </FormControl>
  );
};

export default injectIntl(StopTypeFilter);
