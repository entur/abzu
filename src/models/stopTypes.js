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

const stopTypes = {
  onstreetBus: {
    transportMode: "bus",
    submodes: [
      "expressBus",
      "railReplacementBus",
      "airportLinkBus",
      "localBus",
      "nightBus",
      "regionalBus",
      "shuttleBus",
      "schoolBus",
      "sightseeingBus",
    ],
  },
  busStation: { transportMode: "bus" },
  harbourPort: {
    transportMode: "water",
    submodes: [
      "nationalCarFerry",
      "localCarFerry",
      "internationalCarFerry",
      "highSpeedVehicleService",
    ],
  },
  ferryStop: {
    transportMode: "water",
    submodes: [
      "highSpeedPassengerService",
      "localPassengerFerry",
      "internationalPassengerFerry",
      "sightseeingService",
    ],
  },
  railStation: {
    transportMode: "rail",
    submodes: [
      "longDistance",
      "internationalRail",
      "local",
      "touristRailway",
      "nightRail",
      "interregionalRail",
      "regionalRail",
    ],
  },
  onstreetTram: { transportMode: "tram", submodes: ["localTram", "cityTram"] },
  metroStation: { transportMode: "metro", submodes: ["metro"] },
  airport: {
    transportMode: "air",
    submodes: ["domesticFlight", "internationalFlight", "helicopterService"],
  },
  liftStation: { transportMode: "cableway", submodes: ["telecabin"] },
  funicular: { transportMode: "funicular", submodes: ["funicular"] },
  other: {
    transportMode: "unknown", // Or "other", depending on how you want to classify it
    submodes: null, // Or [], if you prefer an empty array. No specific submodes for a generic "other".
  },
};

export const submodes = [
  "airportLinkBus",
  "expressBus",
  "localBus",
  "nightBus",
  "railReplacementBus",
  "regionalBus",
  "schoolBus",
  "shuttleBus",
  "sightseeingBus",
  "localTram",
  "cityTram",
  "internationalRail",
  "interregionalRail",
  "local",
  "longDistance",
  "nightRail",
  "regionalRail",
  "touristRailway",
  "metro",
  "domesticFlight",
  "helicopterService",
  "internationalFlight",
  "highSpeedPassengerService",
  "highSpeedVehicleService",
  "internationalCarFerry",
  "internationalPassengerFerry",
  "localCarFerry",
  "localPassengerFerry",
  "nationalCarFerry",
  "sightseeingService",
  "telecabin",
  "funicular",
];

export default stopTypes;
