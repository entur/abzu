import { Check, Language } from "@mui/icons-material";
import {
  Box,
  Collapse,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  useTheme,
} from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { AnyAction } from "redux";
import { UserActions } from "../../actions";
import { useConfig } from "../../config/ConfigContext";
import { DEFAULT_LOCALE } from "../../localization/localization";

interface LanguageMenuProps {
  onClose: () => void;
  isMobile?: boolean;
}

export const LanguageMenu: React.FC<LanguageMenuProps> = ({
  onClose,
  isMobile = false,
}) => {
  const { localeConfig } = useConfig();
  const { formatMessage, locale } = useIntl();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = React.useState(false);

  const language = formatMessage({ id: "language" });

  const updateSelectedLocale = (localeOption: string) => {
    dispatch(UserActions.applyLocale(localeOption) as unknown as AnyAction);
    onClose();
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const settingItemStyle = {
    py: 0.5,
    px: 2,
    borderRadius: 1,
    mx: 1,
    mb: 0.5,
    fontSize: "0.875rem",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  };

  const localeOptions = (localeConfig?.locales as string[]) || [DEFAULT_LOCALE];

  if (isMobile) {
    return (
      <Box>
        <ListItem
          onClick={handleClick}
          sx={{
            py: 1,
            px: 2,
            borderRadius: 1,
            mx: 1,
            mb: 0.5,
            cursor: "pointer",
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 36,
              color: theme.palette.primary.main,
            }}
          >
            <Language />
          </ListItemIcon>
          <ListItemText primary={language} />
        </ListItem>

        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <MenuList sx={{ pl: 2 }}>
            {localeOptions.map((localeOption) => (
              <MenuItem
                key={"language-menu-" + localeOption}
                onClick={() => updateSelectedLocale(localeOption)}
                sx={settingItemStyle}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  {locale === localeOption ? (
                    <Check fontSize="small" color="primary" />
                  ) : (
                    <Box sx={{ width: 20, height: 20 }} />
                  )}
                </ListItemIcon>
                <ListItemText primary={formatMessage({ id: localeOption })} />
              </MenuItem>
            ))}
          </MenuList>
        </Collapse>
      </Box>
    );
  }

  return (
    <Box>
      <MenuItem
        onClick={handleClick}
        sx={{
          py: 1,
          px: 2,
          borderRadius: 1,
          mx: 1,
          mb: 0.5,
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 36,
            color: theme.palette.primary.main,
          }}
        >
          <Language />
        </ListItemIcon>
        <ListItemText primary={language} />
      </MenuItem>

      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <MenuList sx={{ pl: 2 }}>
          {localeOptions.map((localeOption) => (
            <MenuItem
              key={"language-menu-" + localeOption}
              onClick={() => updateSelectedLocale(localeOption)}
              sx={settingItemStyle}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                {locale === localeOption ? (
                  <Check fontSize="small" color="primary" />
                ) : (
                  <Box sx={{ width: 20, height: 20 }} />
                )}
              </ListItemIcon>
              <ListItemText primary={formatMessage({ id: localeOption })} />
            </MenuItem>
          ))}
        </MenuList>
      </Collapse>
    </Box>
  );
};
