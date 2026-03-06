import airport from "../static/icons/modalities/airport-without-box.png";
import onstreetBus from "../static/icons/modalities/bus-without-box.png";
import busStation from "../static/icons/modalities/busstation-without-box.png";
import ferryStop from "../static/icons/modalities/ferry-without-box.png";
import funicular from "../static/icons/modalities/funicular.png";
import harbourPort from "../static/icons/modalities/harbour_port.png";
import liftStation from "../static/icons/modalities/lift-without-box.png";
import metroStation from "../static/icons/modalities/metro-without-box.png";
import multiModal from "../static/icons/modalities/multiModal.png";
import noInformation from "../static/icons/modalities/no-information.png";
import railReplacementBus from "../static/icons/modalities/railReplacement.png";
import railStation from "../static/icons/modalities/rails-without-box.png";
import onstreetTram from "../static/icons/modalities/tram-without-box.png";

import airportSvg from "../static/icons/modalities/svg/airplane-withoutBox.svg";
import onstreetBusSvg from "../static/icons/modalities/svg/bus-withoutBox.svg";
import busStationSvg from "../static/icons/modalities/svg/busstation-withoutBox.svg";
import ferryStopSvg from "../static/icons/modalities/svg/ferry-withoutBox.svg";
import funicularSvg from "../static/icons/modalities/svg/funicular.svg";
import harbourPortSvg from "../static/icons/modalities/svg/harbour_port.svg";
import liftStationSvg from "../static/icons/modalities/svg/lift.svg";
import noInformationSvg from "../static/icons/modalities/svg/no-information.svg";
import railStationSvg from "../static/icons/modalities/svg/rail-withoutBox.svg";
import railReplacementBusSvg from "../static/icons/modalities/svg/railReplacement.svg";
import metroStationSvg from "../static/icons/modalities/svg/subway-withoutBox.svg";
import onstreetTramSvg from "../static/icons/modalities/svg/tram-withoutBox.svg";

type Submodes = "railReplacementBus" | "funicular";
type Modalities =
  | "onstreetBus"
  | "onstreetTram"
  | "railStation"
  | "metroStation"
  | "busStation"
  | "ferryStop"
  | "airport"
  | "harbourPort"
  | "liftStation"
  | "funicular"
  | "other";

export const getIconByTypeOrSubmode = (
  submode: Submodes,
  type: Modalities,
  isMultimodal: boolean,
) => {
  const submodeMap = {
    railReplacementBus,
    funicular,
  };

  return submodeMap[submode] || getIconByModality(type, isMultimodal);
};

export const getIconByModality = (type: Modalities, isMultimodal: boolean) => {
  if (isMultimodal) {
    return multiModal;
  }

  const modalityMap = {
    onstreetBus,
    onstreetTram,
    railStation,
    metroStation,
    busStation,
    ferryStop,
    airport,
    harbourPort,
    liftStation,
    funicular,
    other: noInformation,
  };

  const stopType = modalityMap[type] || noInformation;

  return stopType;
};

export const getSvgIconByTypeOrSubmode = (
  submode: Submodes,
  type: Modalities,
) => {
  const submodeMap = {
    railReplacementBus: railReplacementBusSvg,
    funicular: funicularSvg,
  };
  return submodeMap[submode] || getSvgIconIdByModality(type);
};

export const getSvgIconIdByModality = (type: Modalities) => {
  const modalityMap = {
    onstreetBus: onstreetBusSvg,
    onstreetTram: onstreetTramSvg,
    railStation: railStationSvg,
    metroStation: metroStationSvg,
    busStation: busStationSvg,
    ferryStop: ferryStopSvg,
    airport: airportSvg,
    harbourPort: harbourPortSvg,
    liftStation: liftStationSvg,
    funicular: funicularSvg,
    other: noInformationSvg,
  };
  return modalityMap[type] || noInformationSvg;
};
