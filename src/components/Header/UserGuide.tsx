import MdHelp from "@mui/icons-material/Help";
import MenuItem from "@mui/material/MenuItem";
import { useIntl } from "react-intl";
import { useConfig } from "../../config/ConfigContext";

const UserGuide = () => {
  const { extUserGuideLink } = useConfig();
  const defaultUserGuideLink =
    "https://enturas.atlassian.net/wiki/spaces/PUBLIC/pages/1225523302/User+guide+national+stop+place+registry";
  const { formatMessage, locale, defaultLocale } = useIntl();
  const userGuideLink = extUserGuideLink ? extUserGuideLink[locale || defaultLocale] : defaultUserGuideLink

  return (
    <MenuItem
      component={"a"}
      href={userGuideLink}
      target="_blank"
      style={{
        fontSize: 12,
        padding: 0,
        paddingBottom: 5,
        paddingTop: 5,
        width: 300,
      }}
    >
      <MdHelp />
      {formatMessage({ id: "user_guide" })}
    </MenuItem>
  );
};

export default UserGuide;
