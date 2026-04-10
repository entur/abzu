import InfoIcon from "@mui/icons-material/Info";
import { useIntl } from "react-intl";
import MoreMenuItem from "../../../components/MainPage/MoreMenuItem";
import ExternalLinkMenuItem from "./ExternalLinkMenuItem";

const About = () => {
  const { formatMessage, locale } = useIntl();
  const swedishLink = "https://www.fintraffic.fi/sv/digitalatjanster/peti";
  // also used for English:
  const defaultLink =
    "https://www.fintraffic.fi/fi/digitaalisetpalvelut/fintrafficin-datapalvelut/liikkumisen-tietopalvelut/peti";

  return (
    <MoreMenuItem
      openLeft={true}
      leftIcon={<InfoIcon />}
      label={formatMessage({
        id: "Fintraffic-about",
      })}
      style={{
        fontSize: 12,
        padding: 0,
        paddingBottom: 5,
        paddingTop: 5,
        width: 300,
      }}
    >
      <ExternalLinkMenuItem
        href={locale == "sv" ? swedishLink : defaultLink}
        localisationId={"Fintraffic-instructions"}
      />
      <ExternalLinkMenuItem
        href={locale == "sv" ? swedishLink : defaultLink}
        localisationId={"Fintraffic-terms"}
      />
      <ExternalLinkMenuItem
        href={locale == "sv" ? swedishLink : defaultLink}
        localisationId={"Fintraffic-privacy"}
      />
      <ExternalLinkMenuItem
        href={
          "https://enturas.atlassian.net/wiki/spaces/PUBLIC/pages/1225523302/User+guide+national+stop+place+registry"
        }
        localisationId={"Entur-cooperation"}
      />
    </MoreMenuItem>
  );
};

export default About;
