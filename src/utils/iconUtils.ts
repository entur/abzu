import railReplacementBus from "../static/icons/modalities/railReplacement.png";
import multiModal from "../static/icons/modalities/multiModal.png";
import onstreetBus from "../static/icons/modalities/bus-without-box.png";
import onstreetTram from "../static/icons/modalities/tram-without-box.png";
import railStation from "../static/icons/modalities/rails-without-box.png";
import metroStation from "../static/icons/modalities/metro-without-box.png";
import busStation from "../static/icons/modalities/busstation-without-box.png";
import ferryStop from "../static/icons/modalities/ferry-without-box.png";
import airport from "../static/icons/modalities/airport-without-box.png";
import harbourPort from "../static/icons/modalities/harbour_port.png";
import liftStation from "../static/icons/modalities/lift-without-box.png";
import noInformation from "../static/icons/modalities/no-information.png";

type Submodes = "railReplacementBus";
type Modalities =
  | "onstreetBus"
  | "onstreetTram"
  | "railStation"
  | "metroStation"
  | "busStation"
  | "ferryStop"
  | "airport"
  | "harbourPort"
  | "liftStation";

export const getIconByTypeOrSubmode = (
  submode: Submodes,
  type: Modalities,
  isMultimodal: boolean
) => {
  const submodeMap = {
    railReplacementBus,
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
  };

  const stopType = modalityMap[type] || noInformation;

  return stopType;
};
