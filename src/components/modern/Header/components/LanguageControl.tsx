/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
the European Commission - subsequent versions of the EUPL (the "Licence");
You may not use this work except in compliance with the Licence.
You may obtain a copy of the Licence at:

  https://joinup.ec.europa.eu/software/page/eupl

Unless required by applicable law or agreed to in writing, software
distributed under the Licence is distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the Licence for the specific language governing permissions and
limitations under the Licence. */

import { Check, Language } from "@mui/icons-material";
import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { AnyAction } from "redux";
import { UserActions } from "../../../../actions";
import { useConfig } from "../../../../config/ConfigContext";
import { DEFAULT_LOCALE } from "../../../../localization/localization";
import {
  emptyCheckbox,
  menuItemIconSecondary,
  menuItemPrimary,
} from "../../styles";
import { getLanguageOption } from "../languageOptions";

const MENU_MIN_WIDTH = 220;

/**
 * Language picker as its own header control.
 *
 * It used to be a collapsible row buried two levels inside the navigation
 * menu. Standing on its own it is one click to the list, and the current
 * language is readable from the tooltip without opening anything.
 */
export const LanguageControl: React.FC = () => {
  const { localeConfig } = useConfig();
  const { formatMessage, locale } = useIntl();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const localeOptions = (localeConfig?.locales as string[]) || [DEFAULT_LOCALE];
  const { nativeName: activeLanguageName } = getLanguageOption(locale);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectLocale = (localeOption: string) => {
    dispatch(UserActions.applyLocale(localeOption) as unknown as AnyAction);
    handleClose();
  };

  return (
    <>
      <Tooltip
        title={`${formatMessage({ id: "language" })}: ${activeLanguageName}`}
      >
        <IconButton
          color="inherit"
          aria-label={formatMessage({ id: "language" })}
          aria-haspopup="true"
          onClick={handleOpen}
          sx={{ p: { xs: 1, sm: 1.5 } }}
        >
          <Language />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              minWidth: MENU_MIN_WIDTH,
              borderRadius: 2,
              boxShadow: theme.shadows[8],
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {localeOptions.map((localeOption) => {
          const { flag, nativeName } = getLanguageOption(localeOption);
          return (
            <MenuItem
              key={`language-${localeOption}`}
              selected={locale === localeOption}
              onClick={() => handleSelectLocale(localeOption)}
              sx={menuItemPrimary(theme)}
            >
              <ListItemIcon sx={menuItemIconSecondary}>
                {locale === localeOption ? (
                  <Check fontSize="small" color="primary" />
                ) : (
                  <Box sx={emptyCheckbox} />
                )}
              </ListItemIcon>
              <ListItemText primary={`${flag} ${nativeName}`} />
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};
