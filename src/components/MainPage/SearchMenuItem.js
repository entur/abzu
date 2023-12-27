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

import React from "react";
import ModalityIconImg from "./ModalityIconImg";
import MenuItem from "material-ui/MenuItem";
import ModalityIconTray from "../ReportPage/ModalityIconTray";
import { hasExpired, isFuture } from "../../modelUtils/validBetween";
import { Entities } from "../../models/Entities";
import MdGroup from "material-ui/svg-icons/action/group-work";

export const createSearchMenuItem = (element, formatMessage) => {
  if (!element) return null;

  if (element.entityType === Entities.STOP_PLACE) {
    if (element.isParent) {
      return createParentStopPlaceMenuItem(element, formatMessage);
    } else {
      return createStopPlaceMenuItem(element, formatMessage);
    }
  } else if (element.entityType === Entities.GROUP_OF_STOP_PLACE) {
    return createGroupOfStopPlacesMenuItem(element, formatMessage);
  } else {
    console.error(
      `createSearchMenuItem: ${element.entityType} is not supported`,
    );
  }
};

const getFutureOrExpiredLabel = (stopPlace) => {
  if (stopPlace.permanentlyTerminated) {
    return "search_result_permanently_terminated";
  }
  if (hasExpired(stopPlace.validBetween)) {
    return "search_result_expired";
  }
  if (isFuture(stopPlace.validBetween)) {
    return "search_result_future";
  }
  return null;
};

const topographicPlaceStyle = {
  color: "grey",
  marginTop: -20,
  marginBottom: -10,
  fontSize: "0.7em",
  display: "flex",
  justifyContent: "space-between",
};

const createGroupOfStopPlacesMenuItem = (element, formatMessage) => {
  return {
    element,
    text: element.name,
    value: (
      <MenuItem
        style={{ marginTop: 0, width: "auto" }}
        key={element.id}
        innerDivStyle={{ padding: "0px 16px 0px 0px" }}
        primaryText={
          <div style={{ display: "flex" }}>
            <div
              style={{
                marginLeft: 10,
                display: "flex",
                flexDirection: "column",
                minWidth: 280,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontSize: "0.9em" }}>{element.name}</div>
                <div style={{ fontSize: "0.6em", color: "grey" }}>
                  {element.id}
                </div>
              </div>
              {element.topographicPlaces.length && (
                <div style={topographicPlaceStyle}>
                  {element.topographicPlaces.map((place, i) => (
                    <div key={"place-" + i} style={{ marginRight: 5 }}>
                      {`${place.topographicPlace}, ${place.parentTopographicPlace}`}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <MdGroup
              style={{ marginTop: 10, marginLeft: 5, transform: "scale(0.8)" }}
            />
          </div>
        }
      />
    ),
  };
};

const createParentStopPlaceMenuItem = (element, formatMessage) => {
  const futureOrExpiredLabel = getFutureOrExpiredLabel(element);
  return {
    element,
    text: element.name,
    value: (
      <MenuItem
        style={{ marginTop: 0, width: "auto" }}
        key={element.id}
        innerDivStyle={{ padding: "0px 16px 0px 0px" }}
        primaryText={
          <div style={{ display: "flex" }}>
            <div
              style={{
                marginLeft: 10,
                display: "flex",
                flexDirection: "column",
                minWidth: 280,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontSize: "0.9em" }}>
                  {element.name}
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: "0.7em",
                      marginLeft: 5,
                    }}
                  >
                    MM
                  </span>
                </div>
                <div style={{ fontSize: "0.6em", color: "grey" }}>
                  {element.id}
                </div>
              </div>
              <div style={topographicPlaceStyle}>
                <div>{`${element.topographicPlace}, ${element.parentTopographicPlace}`}</div>
                {futureOrExpiredLabel && (
                  <div
                    key={"valid-label" + element.id}
                    style={{ marginRight: 5 }}
                  >
                    {formatMessage({ id: futureOrExpiredLabel })}
                  </div>
                )}
              </div>
            </div>
            <ModalityIconTray
              style={{
                marginLeft: 7,
                display: "flex",
                flexDirection: "column",
              }}
              modalities={element.children.map((child) => ({
                submode: child.submode,
                stopPlaceType: child.stopPlaceType,
              }))}
            />
          </div>
        }
      />
    ),
  };
};

const createStopPlaceMenuItem = (element, formatMessage) => {
  const futureOrExpiredLabel = getFutureOrExpiredLabel(element);
  return {
    element: element,
    text: element.name,
    value: (
      <MenuItem
        style={{ marginTop: 0, width: "auto" }}
        key={element.id}
        innerDivStyle={{ padding: "0px 16px 0px 0px" }}
        primaryText={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div
              style={{
                marginLeft: 10,
                display: "flex",
                flexDirection: "column",
                minWidth: 280,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontSize: "0.9em" }}>{element.name}</div>
                <div style={{ fontSize: "0.6em", color: "grey" }}>
                  {element.id}
                </div>
              </div>
              <div style={topographicPlaceStyle}>
                <div>{`${element.topographicPlace}, ${element.parentTopographicPlace}`}</div>
                {futureOrExpiredLabel && (
                  <div
                    key={"valid-label" + element.id}
                    style={{ marginRight: 5 }}
                  >
                    {formatMessage({ id: futureOrExpiredLabel })}
                  </div>
                )}
              </div>
            </div>
            <ModalityIconImg
              svgStyle={{
                marginTop: 10,
                marginRight: 0,
                transform: "translate3d(0,0,0)",
              }}
              style={{ display: "inline-block", position: "relative" }}
              iconStyle={{
                transform: "scale(0.8)",
              }}
              type={element.stopPlaceType}
              submode={element.submode}
            />
          </div>
        }
      />
    ),
  };
};
