import { Check } from "@mui/icons-material";
import MdLanguage from "@mui/icons-material/Language";
import MenuItem from "@mui/material/MenuItem";
import { UnknownAction } from "@reduxjs/toolkit";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { UserActions } from "../../actions";
import { useConfig } from "../../config/ConfigContext";
import { DEFAULT_LOCALE } from "../../localization/localization";
import MoreMenuItem from "../MainPage/MoreMenuItem";

export const LanguageMenu = () => {
  const { localeConfig } = useConfig();
  const { formatMessage, locale } = useIntl();
  const language = formatMessage({ id: "language" });
  const dispatch = useDispatch();
  const updateSelectedLocale = (localeOption: string) => {
    dispatch(UserActions.applyLocale(localeOption) as unknown as UnknownAction);
  };

  return (
    <MoreMenuItem
      openLeft={true}
      leftIcon={<MdLanguage />}
      label={language}
      style={{
        fontSize: 12,
        padding: 0,
        paddingBottom: 5,
        paddingTop: 5,
        width: 300,
      }}
    >
      {((localeConfig?.locales as string[]) || [DEFAULT_LOCALE]).map(
        (localeOption) => (
          <MenuItem
            key={"language-menu-" + localeOption}
            style={{
              fontSize: 12,
              padding: 0,
              paddingBottom: 5,
              paddingTop: 5,
              width: 300,
            }}
            onClick={() => updateSelectedLocale(localeOption)}
          >
            {locale === localeOption ? (
              <Check />
            ) : (
              <div style={{ width: "24px", height: "24px" }} />
            )}
            {formatMessage({
              id: localeOption,
            })}
          </MenuItem>
        ),
      )}
    </MoreMenuItem>
  );
};
