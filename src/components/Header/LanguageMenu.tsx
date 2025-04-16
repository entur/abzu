import { Check } from "@mui/icons-material";
import MdLanguage from "@mui/icons-material/Language";
import MenuItem from "@mui/material/MenuItem";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { UserActions } from "../../actions";
import { Locale, useConfig } from "../../config/ConfigContext";
import MoreMenuItem from "../MainPage/MoreMenuItem";

export const LanguageMenu = () => {
  const allLocales = Object.values(Locale) as Locale[];
  const { localeConfig } = useConfig();
  const { formatMessage, locale } = useIntl();
  const language = formatMessage({ id: "language" });
  const dispatch = useDispatch();

  const getLanguagePickerLocaleMessageKey = (locale: Locale): string => {
    switch (locale) {
      case Locale.EN:
        return "english";
      case Locale.SV:
        return "swedish";
      case Locale.NB:
        return "norwegian";
      case Locale.FR:
        return "french";
      case Locale.FI:
        return "finnish";
      default:
        return locale as string;
    }
  };

  return (
    <MoreMenuItem
      openLeft={true}
      leftIcon={<MdLanguage color="#41c0c4" />}
      label={language}
      style={{
        fontSize: 12,
        padding: 0,
        paddingBottom: 5,
        paddingTop: 5,
        width: 300,
      }}
    >
      {(localeConfig?.locales || allLocales).map((localeOption) => (
        <MenuItem
          style={{
            fontSize: 12,
            padding: 0,
            paddingBottom: 5,
            paddingTop: 5,
            width: 300,
          }}
          onClick={() => dispatch(UserActions.applyLocale(localeOption))}
          checked={locale === localeOption}
        >
          {locale === localeOption ? (
            <Check />
          ) : (
            <div style={{ width: "24px", height: "24px" }} />
          )}
          {formatMessage({
            id: getLanguagePickerLocaleMessageKey(localeOption),
          })}
        </MenuItem>
      ))}
    </MoreMenuItem>
  );
};
