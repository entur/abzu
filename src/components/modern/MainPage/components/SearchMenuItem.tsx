/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
the European Commission - subsequent versions of the EUPL (the "Licence");
You may not use this work except in compliance with the Licence.
You may obtain a copy of the Licence at:

  https://joinup.ec.europa.eu/software/page/eupl

Unless required by applicable law or agreed to in writing, software
distributed under the Licence is distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the Licence for the specific language governing permissions and
limitations under the Licence. */

import MdGroup from "@mui/icons-material/GroupWork";
import { hasExpired, isFuture } from "../../../../modelUtils/validBetween";
import { Entities } from "../../../../models/Entities";
import ModalityIconImg from "../../../MainPage/ModalityIconImg";
import ModalityIconTray from "../../../ReportPage/ModalityIconTray";
import { MenuItem, SearchResult } from "../types";
import { SearchResultRow } from "./SearchResultRow";

interface TopographicPlace {
  topographicPlace: string;
  parentTopographicPlace: string;
}

interface FormatMessage {
  (descriptor: { id: string }): string;
}

export const createSearchMenuItem = (
  element: SearchResult | null,
  formatMessage: FormatMessage,
): MenuItem | null => {
  if (!element) return null;
  if (element.entityType === Entities.STOP_PLACE) {
    if (element.isParent) {
      return createParentStopPlaceMenuItem(element, formatMessage);
    } else {
      return createStopPlaceMenuItem(element, formatMessage);
    }
  } else if (element.entityType === Entities.GROUP_OF_STOP_PLACE) {
    return createGroupOfStopPlacesMenuItem(element);
  } else {
    console.error(
      `createSearchMenuItem: ${element.entityType} is not supported`,
    );
    return null;
  }
};

const getFutureOrExpiredLabel = (stopPlace: SearchResult): string | null => {
  if ((stopPlace as any).permanentlyTerminated) {
    return "search_result_permanently_terminated";
  }
  if (hasExpired((stopPlace as any).validBetween)) {
    return "search_result_expired";
  }
  if (isFuture((stopPlace as any).validBetween)) {
    return "search_result_future";
  }
  return null;
};

const ICON_SIZE = 20;
const iconSvgStyle = { width: ICON_SIZE, height: ICON_SIZE };

const locationOf = (element: SearchResult): string =>
  `${element.topographicPlace}, ${element.parentTopographicPlace}`;

const createGroupOfStopPlacesMenuItem = (element: SearchResult): MenuItem => {
  const topographicPlaces =
    ((element as any).topographicPlaces as TopographicPlace[]) || [];

  return {
    element,
    text: element.name,
    id: element.id,
    menuDiv: (
      <SearchResultRow
        name={element.name}
        id={element.id}
        locations={topographicPlaces.map(
          (place) =>
            `${place.topographicPlace}, ${place.parentTopographicPlace}`,
        )}
        icons={<MdGroup fontSize="small" color="action" />}
      />
    ),
  };
};

const createParentStopPlaceMenuItem = (
  element: SearchResult,
  formatMessage: FormatMessage,
): MenuItem => {
  const futureOrExpiredLabel = getFutureOrExpiredLabel(element);
  return {
    element: element,
    text: element.name,
    id: element.id,
    menuDiv: (
      <SearchResultRow
        name={element.name}
        badge="MM"
        id={element.id}
        locations={[locationOf(element)]}
        status={
          futureOrExpiredLabel && formatMessage({ id: futureOrExpiredLabel })
        }
        icons={
          <ModalityIconTray
            style={{ display: "flex", alignItems: "center", gap: 2 }}
            modalities={
              element.children?.map((child) => ({
                submode: child.submode,
                stopPlaceType: child.stopPlaceType,
              })) || []
            }
          />
        }
      />
    ),
  };
};

const createStopPlaceMenuItem = (
  element: SearchResult,
  formatMessage: FormatMessage,
): MenuItem => {
  const futureOrExpiredLabel = getFutureOrExpiredLabel(element);
  return {
    element: element,
    text: element.name,
    id: element.id,
    menuDiv: (
      <SearchResultRow
        name={element.name}
        id={element.id}
        locations={[locationOf(element)]}
        status={
          futureOrExpiredLabel && formatMessage({ id: futureOrExpiredLabel })
        }
        icons={
          <ModalityIconImg
            type={element.stopPlaceType}
            submode={element.submode}
            svgStyle={iconSvgStyle}
          />
        }
      />
    ),
  };
};
