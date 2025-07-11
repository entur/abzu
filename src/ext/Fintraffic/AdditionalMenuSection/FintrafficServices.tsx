import { useIntl } from "react-intl";
import MoreMenuItem from "../../../components/MainPage/MoreMenuItem";
import ExternalLinkMenuItem from "./ExternalLinkMenuItem";
import logo from "./favicon.ico";

const FintrafficServices = () => {
  const { formatMessage, locale } = useIntl();

  return (
    <MoreMenuItem
      openLeft={true}
      leftIcon={
        <img style={{ width: 24 }} className="logo" src={logo} alt={""} />
      }
      label={"Fintraffic"}
      style={{
        fontSize: 12,
        padding: 0,
        paddingBottom: 5,
        paddingTop: 5,
        width: 300,
      }}
    >
      <ExternalLinkMenuItem
        href={"https://liikennetilanne.fintraffic.fi/pulssi/?lang=" + locale}
        localisationId={"Fintraffic-traffic"}
      />
      <ExternalLinkMenuItem
        href={
          "https://www.palautevayla.fi/aspa/en/liikenteen-asiakaspalvelu-etsi-tietoa?lang=" +
          locale
        }
        localisationId={"Fintraffic-feedback"}
      />
      <ExternalLinkMenuItem
        href={
          "https://junalahdot.fintraffic.fi/?lang=" +
          (locale === "sv" ? "se" : locale)
        }
        localisationId={"Fintraffic-train"}
      />
      <ExternalLinkMenuItem
        href={`https://www.fintraffic.fi/${locale}/${formatMessage({ id: "Fintraffic-fintrafficAppLink" })}`}
        localisationId={"Fintraffic-fintrafficApp"}
      />
      <ExternalLinkMenuItem
        href={"https://www.digitraffic.fi/" + (locale === "en" ? "en" : "")}
        localisationId={"Fintraffic-digitraffic"}
      />
      <ExternalLinkMenuItem
        href={"https://digitransit.fi/" + (locale === "en" ? "en" : "")}
        localisationId={"Fintraffic-digitransit"}
      />
      <ExternalLinkMenuItem
        href={"https://finap.fi/#/"}
        localisationId={"Fintraffic-nap"}
      />
    </MoreMenuItem>
  );
};

export default FintrafficServices;
