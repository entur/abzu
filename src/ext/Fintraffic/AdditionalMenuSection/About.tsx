import InfoIcon from "@mui/icons-material/Info";
import { useIntl } from "react-intl";
import MoreMenuItem from "../../../components/MainPage/MoreMenuItem";
import ExternalLinkMenuItem from "./ExternalLinkMenuItem";

const About = () => {
  const { formatMessage } = useIntl();

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
        href={
          "https://www.fintraffic.fi/fi/digitaalisetpalvelut/fintrafficin-datapalvelut/liikkumisen-tietopalvelut/joukkoliikenteen-tietopalvelut"
        }
        localisationId={"Fintraffic-instructions"}
      />
      <ExternalLinkMenuItem
        href={
          "https://www.fintraffic.fi/fi/digitaalisetpalvelut/fintrafficin-datapalvelut/liikkumisen-tietopalvelut/joukkoliikenteen-tietopalvelut"
        }
        localisationId={"Fintraffic-terms"}
      />
      <ExternalLinkMenuItem
        href={
          "https://www.fintraffic.fi/fi/digitaalisetpalvelut/fintrafficin-datapalvelut/liikkumisen-tietopalvelut/joukkoliikenteen-tietopalvelut"
        }
        localisationId={"Fintraffic-privacy"}
      />
    </MoreMenuItem>
  );
};

export default About;
