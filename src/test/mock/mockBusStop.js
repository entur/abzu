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

const mockBusStop = {
  data: {
    pathLink: [],
    stopPlace: [
      {
        __typename: "StopPlace",
        id: "NSR:StopPlace:418",
        name: { value: "Asker", __typename: "EmbeddableMultilingualString" },
        alternativeNames: [],
        weighting: "interchangeAllowed",
        description: {
          value: null,
          __typename: "EmbeddableMultilingualString",
        },
        geometry: {
          legacyCoordinates: [[10.434486, 59.833343]],
          __typename: "GeoJSON",
        },
        quays: [
          {
            id: "NSR:Quay:695",
            geometry: {
              legacyCoordinates: [[10.434574, 59.833321]],
              __typename: "GeoJSON",
            },
            version: "7",
            compassBearing: null,
            publicCode: "4",
            privateCode: { value: "4", __typename: "PrivateCode" },
            description: {
              value: "",
              __typename: "EmbeddableMultilingualString",
            },
            keyValues: [
              {
                key: "grails-platformId",
                values: ["7987"],
                __typename: "KeyValues",
              },
              { key: "uicCode", values: ["7601413"], __typename: "KeyValues" },
              {
                key: "imported-id",
                values: ["NSB:Quay:0076014134"],
                __typename: "KeyValues",
              },
            ],
            accessibilityAssessment: null,
            placeEquipments: null,
            __typename: "Quay",
          },
          {
            id: "NSR:Quay:696",
            geometry: {
              legacyCoordinates: [[10.434846, 59.833237]],
              __typename: "GeoJSON",
            },
            version: "7",
            compassBearing: null,
            publicCode: "6",
            privateCode: { value: "6", __typename: "PrivateCode" },
            description: {
              value: "",
              __typename: "EmbeddableMultilingualString",
            },
            keyValues: [
              {
                key: "grails-platformId",
                values: ["7989"],
                __typename: "KeyValues",
              },
              { key: "uicCode", values: ["7601413"], __typename: "KeyValues" },
              {
                key: "imported-id",
                values: ["NSB:Quay:0076014136"],
                __typename: "KeyValues",
              },
            ],
            accessibilityAssessment: null,
            placeEquipments: null,
            __typename: "Quay",
          },
          {
            id: "NSR:Quay:697",
            geometry: {
              legacyCoordinates: [[10.43442, 59.833368]],
              __typename: "GeoJSON",
            },
            version: "7",
            compassBearing: null,
            publicCode: "3",
            privateCode: { value: "3", __typename: "PrivateCode" },
            description: {
              value: "",
              __typename: "EmbeddableMultilingualString",
            },
            keyValues: [
              {
                key: "grails-platformId",
                values: ["7986"],
                __typename: "KeyValues",
              },
              { key: "uicCode", values: ["7601413"], __typename: "KeyValues" },
              {
                key: "imported-id",
                values: ["NSB:Quay:0076014133"],
                __typename: "KeyValues",
              },
            ],
            accessibilityAssessment: null,
            placeEquipments: null,
            __typename: "Quay",
          },
          {
            id: "NSR:Quay:698",
            geometry: {
              legacyCoordinates: [[10.434126, 59.833448]],
              __typename: "GeoJSON",
            },
            version: "7",
            compassBearing: null,
            publicCode: "1",
            privateCode: { value: "1", __typename: "PrivateCode" },
            description: {
              value: "",
              __typename: "EmbeddableMultilingualString",
            },
            keyValues: [
              {
                key: "grails-platformId",
                values: ["7984"],
                __typename: "KeyValues",
              },
              { key: "uicCode", values: ["7601413"], __typename: "KeyValues" },
              {
                key: "imported-id",
                values: [
                  "NSB:Quay:076014131",
                  "NSB:Quay:007601413",
                  "FLT:Quay:7601413",
                  "NSB:Quay:0076014131",
                ],
                __typename: "KeyValues",
              },
            ],
            accessibilityAssessment: null,
            placeEquipments: null,
            __typename: "Quay",
          },
          {
            id: "NSR:Quay:699",
            geometry: {
              legacyCoordinates: [[10.434682, 59.833288]],
              __typename: "GeoJSON",
            },
            version: "7",
            compassBearing: null,
            publicCode: "5",
            privateCode: { value: "5", __typename: "PrivateCode" },
            description: {
              value: "",
              __typename: "EmbeddableMultilingualString",
            },
            keyValues: [
              {
                key: "grails-platformId",
                values: ["7988"],
                __typename: "KeyValues",
              },
              { key: "uicCode", values: ["7601413"], __typename: "KeyValues" },
              {
                key: "imported-id",
                values: ["NSB:Quay:0076014135"],
                __typename: "KeyValues",
              },
            ],
            accessibilityAssessment: null,
            placeEquipments: null,
            __typename: "Quay",
          },
          {
            id: "NSR:Quay:700",
            geometry: {
              legacyCoordinates: [[10.434301, 59.833399]],
              __typename: "GeoJSON",
            },
            version: "7",
            compassBearing: null,
            publicCode: "2",
            privateCode: { value: "2", __typename: "PrivateCode" },
            description: {
              value: "",
              __typename: "EmbeddableMultilingualString",
            },
            keyValues: [
              {
                key: "grails-platformId",
                values: ["7985"],
                __typename: "KeyValues",
              },
              { key: "uicCode", values: ["7601413"], __typename: "KeyValues" },
              {
                key: "imported-id",
                values: ["NSB:Quay:0076014132"],
                __typename: "KeyValues",
              },
            ],
            accessibilityAssessment: null,
            placeEquipments: null,
            __typename: "Quay",
          },
        ],
        version: "7",
        keyValues: [
          { key: "jbvCode", values: ["ASR"], __typename: "KeyValues" },
          { key: "uicCode", values: ["7601413"], __typename: "KeyValues" },
          { key: "grailsId", values: ["17"], __typename: "KeyValues" },
          { key: "iffCode", values: ["7601413"], __typename: "KeyValues" },
          { key: "lisaId", values: ["1413"], __typename: "KeyValues" },
          {
            key: "imported-id",
            values: [
              "NRI:StopPlace:761005879",
              "NSB:StopPlace:007601413",
              "FLT:StopPlace:7601413",
              "NSB:StopPlace:07601413",
            ],
            __typename: "KeyValues",
          },
        ],
        stopPlaceType: "onstreetBus",
        submode: null,
        transportMode: "rail",
        tariffZones: [
          {
            name: { value: "2V", __typename: "EmbeddableMultilingualString" },
            id: "RUT:TariffZone:2V",
            __typename: "TariffZone",
          },
        ],
        topographicPlace: {
          name: { value: "Asker", __typename: "EmbeddableMultilingualString" },
          parentTopographicPlace: {
            name: {
              value: "Akershus",
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
            escalatorFreeAccess: "UNKNOWN",
            liftFreeAccess: "UNKNOWN",
            audibleSignalsAvailable: "UNKNOWN",
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
          sanitaryEquipment: null,
          ticketingEquipment: [
            {
              ticketOffice: null,
              ticketMachines: null,
              numberOfMachines: 7,
              audioInterfaceAvailable: false,
              tactileInterfaceAvailable: false,
              __typename: "TicketingEquipment",
            },
          ],
          cycleStorageEquipment: null,
          shelterEquipment: null,
          __typename: "PlaceEquipments",
        },
        validBetween: {
          fromDate: "2017-08-07T13:54:56.000+0200",
          toDate: null,
          __typename: "ValidBetween",
        },
        __typename: "StopPlace",
      },
    ],
    parking: [
      {
        id: "NSR:Parking:279",
        totalCapacity: 0,
        name: { value: "Asker", __typename: "EmbeddableMultilingualString" },
        geometry: {
          legacyCoordinates: [[10.43469, 59.83353]],
          __typename: "GeoJSON",
        },
        parkingVehicleTypes: ["pedalCycle"],
        validBetween: {
          fromDate: "2017-06-26T14:43:17.429+0200",
          toDate: null,
          __typename: "ValidBetween",
        },
        __typename: "Parking",
      },
      {
        id: "NSR:Parking:411",
        totalCapacity: 644,
        name: { value: "Asker", __typename: "EmbeddableMultilingualString" },
        geometry: {
          legacyCoordinates: [[10.43469, 59.83353]],
          __typename: "GeoJSON",
        },
        parkingVehicleTypes: ["car"],
        validBetween: {
          fromDate: "2017-06-26T14:43:18.519+0200",
          toDate: "2017-08-07T13:54:53.756+0200",
          __typename: "ValidBetween",
        },
        __typename: "Parking",
      },
    ],
    versions: [
      {
        id: "NSR:StopPlace:418",
        validBetween: {
          fromDate: "2017-06-19T19:12:50.429+0200",
          toDate: "2017-06-26T14:43:16.228+0200",
          __typename: "ValidBetween",
        },
        name: {
          value: "Asker",
          lang: "nor",
          __typename: "EmbeddableMultilingualString",
        },
        version: "1",
        versionComment: null,
        __typename: "StopPlace",
      },
      {
        id: "NSR:StopPlace:418",
        validBetween: {
          fromDate: "2017-06-26T14:43:14.000+0200",
          toDate: "2017-07-26T12:16:19.000+0200",
          __typename: "ValidBetween",
        },
        name: {
          value: "Asker",
          lang: "nor",
          __typename: "EmbeddableMultilingualString",
        },
        version: "2",
        versionComment: "",
        __typename: "StopPlace",
      },
      {
        id: "NSR:StopPlace:418",
        validBetween: {
          fromDate: "2017-07-26T12:16:19.000+0200",
          toDate: "2017-07-26T12:21:19.000+0200",
          __typename: "ValidBetween",
        },
        name: {
          value: "Asker",
          lang: "nor",
          __typename: "EmbeddableMultilingualString",
        },
        version: "3",
        versionComment: "",
        __typename: "StopPlace",
      },
      {
        id: "NSR:StopPlace:418",
        validBetween: {
          fromDate: "2017-07-26T12:21:19.000+0200",
          toDate: "2017-07-26T13:13:18.000+0200",
          __typename: "ValidBetween",
        },
        name: {
          value: "Asker",
          lang: "nor",
          __typename: "EmbeddableMultilingualString",
        },
        version: "4",
        versionComment: "",
        __typename: "StopPlace",
      },
      {
        id: "NSR:StopPlace:418",
        validBetween: {
          fromDate: "2017-07-26T13:13:18.000+0200",
          toDate: "2017-07-27T15:59:04.000+0200",
          __typename: "ValidBetween",
        },
        name: {
          value: "Asker",
          lang: "nor",
          __typename: "EmbeddableMultilingualString",
        },
        version: "5",
        versionComment: "",
        __typename: "StopPlace",
      },
      {
        id: "NSR:StopPlace:418",
        validBetween: {
          fromDate: "2017-07-27T15:59:04.000+0200",
          toDate: "2017-08-07T13:54:56.000+0200",
          __typename: "ValidBetween",
        },
        name: {
          value: "Asker",
          lang: "nor",
          __typename: "EmbeddableMultilingualString",
        },
        version: "6",
        versionComment: "",
        __typename: "StopPlace",
      },
      {
        id: "NSR:StopPlace:418",
        validBetween: {
          fromDate: "2017-08-07T13:54:56.000+0200",
          toDate: null,
          __typename: "ValidBetween",
        },
        name: {
          value: "Asker",
          lang: "nor",
          __typename: "EmbeddableMultilingualString",
        },
        version: "7",
        versionComment: "deaktiverte innfartsparkering",
        __typename: "StopPlace",
      },
    ],
  },
};

export default mockBusStop;
