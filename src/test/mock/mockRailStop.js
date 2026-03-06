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

const mockRailStop = {
  data: {
    pathLink: [],
    stopPlace: [
      {
        __typename: "StopPlace",
        id: "NSR:StopPlace:94",
        name: {
          value: "Sarpsborg",
          __typename: "EmbeddableMultilingualString",
        },
        alternativeNames: [],
        weighting: "interchangeAllowed",
        description: null,
        geometry: {
          legacyCoordinates: [[11.118251, 59.2860146]],
          __typename: "GeoJSON",
        },
        quays: [
          {
            id: "NSR:Quay:144",
            geometry: {
              legacyCoordinates: [[11.118263, 59.28602]],
              __typename: "GeoJSON",
            },
            version: "1",
            compassBearing: null,
            publicCode: "2",
            privateCode: { value: "2", __typename: "PrivateCode" },
            description: null,
            keyValues: [
              {
                key: "grails-platformId",
                values: ["6086"],
                __typename: "KeyValues",
              },
              { key: "uicCode", values: ["7600527"], __typename: "KeyValues" },
              {
                key: "imported-id",
                values: ["NSB:Quay:0076005272"],
                __typename: "KeyValues",
              },
            ],
            accessibilityAssessment: null,
            placeEquipments: null,
            __typename: "Quay",
          },
          {
            id: "NSR:Quay:145",
            geometry: {
              legacyCoordinates: [[11.118263, 59.28602]],
              __typename: "GeoJSON",
            },
            version: "1",
            compassBearing: null,
            publicCode: "3",
            privateCode: { value: "3", __typename: "PrivateCode" },
            description: null,
            keyValues: [
              {
                key: "grails-platformId",
                values: ["6087"],
                __typename: "KeyValues",
              },
              { key: "uicCode", values: ["7600527"], __typename: "KeyValues" },
              {
                key: "imported-id",
                values: ["NSB:Quay:0076005273"],
                __typename: "KeyValues",
              },
            ],
            accessibilityAssessment: null,
            placeEquipments: null,
            __typename: "Quay",
          },
          {
            id: "NSR:Quay:146",
            geometry: {
              legacyCoordinates: [[11.118263, 59.28602]],
              __typename: "GeoJSON",
            },
            version: "1",
            compassBearing: null,
            publicCode: "4",
            privateCode: { value: "4", __typename: "PrivateCode" },
            description: null,
            keyValues: [
              {
                key: "grails-platformId",
                values: ["6088"],
                __typename: "KeyValues",
              },
              { key: "uicCode", values: ["7600527"], __typename: "KeyValues" },
              {
                key: "imported-id",
                values: ["NSB:Quay:0076005274"],
                __typename: "KeyValues",
              },
            ],
            accessibilityAssessment: null,
            placeEquipments: null,
            __typename: "Quay",
          },
          {
            id: "NSR:Quay:147",
            geometry: {
              legacyCoordinates: [[11.118263, 59.28602]],
              __typename: "GeoJSON",
            },
            version: "1",
            compassBearing: null,
            publicCode: "5",
            privateCode: { value: "5", __typename: "PrivateCode" },
            description: null,
            keyValues: [
              {
                key: "grails-platformId",
                values: ["628320"],
                __typename: "KeyValues",
              },
              { key: "uicCode", values: ["7600527"], __typename: "KeyValues" },
              {
                key: "imported-id",
                values: ["NSB:Quay:0076005275"],
                __typename: "KeyValues",
              },
            ],
            accessibilityAssessment: null,
            placeEquipments: null,
            __typename: "Quay",
          },
          {
            id: "NSR:Quay:149",
            geometry: {
              legacyCoordinates: [[11.118203, 59.285993]],
              __typename: "GeoJSON",
            },
            version: "1",
            compassBearing: null,
            publicCode: "1",
            privateCode: { value: "1", __typename: "PrivateCode" },
            description: null,
            keyValues: [
              {
                key: "grails-platformId",
                values: ["6085"],
                __typename: "KeyValues",
              },
              { key: "uicCode", values: ["7600527"], __typename: "KeyValues" },
              {
                key: "imported-id",
                values: [
                  "NSB:Quay:076005271",
                  "NSB:Quay:0076005271",
                  "NSB:Quay:007600527",
                  "FLT:Quay:7600527",
                ],
                __typename: "KeyValues",
              },
            ],
            accessibilityAssessment: null,
            placeEquipments: null,
            __typename: "Quay",
          },
        ],
        version: "1",
        keyValues: [
          { key: "jbvCode", values: ["SBO"], __typename: "KeyValues" },
          { key: "uicCode", values: ["7600527"], __typename: "KeyValues" },
          { key: "grailsId", values: ["602"], __typename: "KeyValues" },
          { key: "iffCode", values: ["7600527"], __typename: "KeyValues" },
          { key: "lisaId", values: ["527"], __typename: "KeyValues" },
          {
            key: "imported-id",
            values: [
              "NSB:StopPlace:07600527",
              "NSB:StopPlace:007600527",
              "FLT:StopPlace:7600527",
              "NRI:StopPlace:761000887",
            ],
            __typename: "KeyValues",
          },
        ],
        stopPlaceType: "railStation",
        submode: null,
        transportMode: "rail",
        tariffZones: [],
        topographicPlace: {
          name: {
            value: "Sarpsborg",
            __typename: "EmbeddableMultilingualString",
          },
          parentTopographicPlace: {
            name: {
              value: "Østfold",
              __typename: "EmbeddableMultilingualString",
            },
            __typename: "TopographicPlace",
          },
          topographicPlaceType: "municipality",
          __typename: "TopographicPlace",
        },
        accessibilityAssessment: {
          limitations: {
            wheelchairAccess: "TRUE",
            stepFreeAccess: "TRUE",
            escalatorFreeAccess: null,
            liftFreeAccess: null,
            audibleSignalsAvailable: null,
            __typename: "AccessibilityLimitations",
          },
          __typename: "AccessibilityAssessment",
        },
        placeEquipments: {
          generalSign: null,
          waitingRoomEquipment: [
            {
              seats: null,
              heated: null,
              stepFree: null,
              __typename: "WaitingRoomEquipment",
            },
          ],
          sanitaryEquipment: [
            {
              numberOfToilets: null,
              gender: "both",
              sanitaryFacilityList: ["wheelChairAccessToilet"],
              __typename: "SanitaryEquipment",
            },
          ],
          ticketingEquipment: [
            {
              ticketOffice: null,
              ticketMachines: null,
              numberOfMachines: 1,
              __typename: "TicketingEquipment",
            },
          ],
          cycleStorageEquipment: null,
          shelterEquipment: null,
          __typename: "PlaceEquipments",
        },
        validBetween: {
          fromDate: "2017-06-19T19:12:36.194+0200",
          toDate: null,
          __typename: "ValidBetween",
        },
        __typename: "StopPlace",
      },
    ],
    parking: [
      {
        id: "NSR:Parking:302",
        totalCapacity: null,
        name: {
          value: "Sarpsborg",
          __typename: "EmbeddableMultilingualString",
        },
        geometry: {
          legacyCoordinates: [[11.118263, 59.28602]],
          __typename: "GeoJSON",
        },
        parkingVehicleTypes: ["pedalCycle"],
        validBetween: null,
        __typename: "Parking",
      },
      {
        id: "NSR:Parking:372",
        totalCapacity: 97,
        name: {
          value: "Sarpsborg",
          __typename: "EmbeddableMultilingualString",
        },
        geometry: {
          legacyCoordinates: [[11.118263, 59.28602]],
          __typename: "GeoJSON",
        },
        parkingVehicleTypes: ["car"],
        validBetween: null,
        __typename: "Parking",
      },
    ],
    versions: [
      {
        id: "NSR:StopPlace:94",
        validBetween: {
          fromDate: "2017-06-19T19:12:36.194+0200",
          toDate: null,
          __typename: "ValidBetween",
        },
        name: {
          value: "Sarpsborg",
          lang: "nor",
          __typename: "EmbeddableMultilingualString",
        },
        version: "1",
        versionComment: null,
        __typename: "StopPlace",
      },
    ],
  },
};

export default mockRailStop;
