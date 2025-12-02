import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import {
  FeaturePopoverMenuOption,
  FeaturePopoverMenuValue,
  iconColorStates,
} from "./types";

type Props = {
  featureName: string;
  options: FeaturePopoverMenuOption[];
  selectedValue: FeaturePopoverMenuValue;
  disabled?: boolean;
  handleChange: (value: FeaturePopoverMenuValue) => void;
  quayId?: string;
};

const findOptionByValue = (
  value: FeaturePopoverMenuValue,
  options: FeaturePopoverMenuOption[],
) => {
  return options.find((o) => o.value === value);
};

const FeaturePopoverMenu = ({
  disabled,
  featureName,
  options,
  selectedValue,
  handleChange,
  quayId,
}: Props) => {
  const { formatMessage } = useIntl();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const selectedOption = findOptionByValue(selectedValue, options);

  const handleSelectedValueChange = (value: FeaturePopoverMenuValue) => {
    setOpen(false);
    handleChange(value);
  };

  const handleOpenPopover = (event: any) => {
    setOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpen(false);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <IconButton
          onClick={(e) => {
            if (!disabled) handleOpenPopover(e);
          }}
        >
          {selectedOption &&
            React.cloneElement(selectedOption.icon, {
              style: {
                color: selectedOption.color || iconColorStates["DEFAULT"],
              },
            })}
        </IconButton>

        <div style={{ marginLeft: 2.5 }}>
          {formatMessage({
            id: `${featureName}_${selectedValue.toLowerCase()}`,
          })}
        </div>
      </div>
      <Menu
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        onClose={handleClosePopover}
      >
        {options.map((option: FeaturePopoverMenuOption, index: number) => (
          <MenuItem
            key={`${quayId}-${featureName}-popoverOptionValue-${option.value}-${index}`}
            value={option as unknown as string}
            style={{ padding: "0px 10px" }}
            onClick={() => {
              handleSelectedValueChange(option.value);
            }}
          >
            <ListItemIcon>
              {React.cloneElement(option.icon, {
                style: {
                  float: "left",
                  marginTop: 9,
                  marginRight: 5,
                  color: option.color || iconColorStates["DEFAULT"],
                },
              })}
            </ListItemIcon>
            <ListItemText>
              {formatMessage({
                id: `${featureName}_${option.value.toLowerCase()}`,
              })}
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default FeaturePopoverMenu;
