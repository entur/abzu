import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import { useIntl } from "react-intl";
import MoreMenuItem from "../../../components/MainPage/MoreMenuItem";
import ExternalLinkMenuItem from "./ExternalLinkMenuItem";

const Support = () => {
  const { formatMessage } = useIntl();

  return (
    <MoreMenuItem
      openLeft={true}
      leftIcon={<ContactSupportIcon />}
      label={formatMessage({
        id: "Fintraffic-support",
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
        localisationId={"Fintraffic-channels"}
      />
    </MoreMenuItem>
  );
};

export default Support;
