export default [
  {
    "id": "NSR:StopPlace:2",
    "name": "Oslo S",
    "alternativeNames": [],
    "stopPlaceType": "onstreetBus",
    "isActive": true,
    "version": "17",
    "hasExpired": false,
    "transportMode": "bus",
    "submode": "railReplacementBus",
    "tags": [
      {
        "name": "adm_navn",
        "comment": "Navn evt. ikke i henhold til hndbok eller har andre skrivefeil",
        "created": "2017-09-26T18:07:09.990+0200",
        "createdBy": "johan",
        "idReference": "NSR:StopPlace:2",
        "__typename": "Tag"
      }
    ],
    "topographicPlace": "Oslo",
    "parentTopographicPlace": "Oslo",
    "validBetween": {
      "fromDate": "2017-09-26T19:23:40.000+0200",
      "toDate": null,
      "__typename": "ValidBetween"
    },
    "tariffZones": [
      {
        "name": "1",
        "id": "RUT:TariffZone:1"
      }
    ],
    "accessibilityAssessment": {
      "limitations": {
        "wheelchairAccess": "TRUE",
        "stepFreeAccess": "TRUE",
        "escalatorFreeAccess": "UNKNOWN",
        "liftFreeAccess": "UNKNOWN",
        "audibleSignalsAvailable": "UNKNOWN",
        "__typename": "AccessibilityLimitations"
      },
      "__typename": "AccessibilityAssessment"
    },
    "location": [
      59.90965,
      10.754923
    ],
    "importedId": [
      "RUT:StopPlace:3010010-6",
      "TEL:StopPlace:3010010",
      "NSB:StopPlace:760010031",
      "OPP:StopPlace:3010016",
      "TEL:StopPlace:03010010",
      "RUT:StopPlace:03010010-6",
      "RUT:StopPlace:03010010",
      "HED:StopPlace:3010016"
    ],
    "keyValues": [
      {
        "key": "jbvCode",
        "values": [
          "OSL"
        ],
        "__typename": "KeyValues"
      },
      {
        "key": "uicCode",
        "values": [
          "7600100"
        ],
        "__typename": "KeyValues"
      },
      {
        "key": "iffCode",
        "values": [
          "7600100"
        ],
        "__typename": "KeyValues"
      },
      {
        "key": "lisaId",
        "values": [
          "100"
        ],
        "__typename": "KeyValues"
      },
      {
        "key": "imported-id",
        "values": [
          "RUT:StopPlace:3010010-6",
          "TEL:StopPlace:3010010",
          "NSB:StopPlace:760010031",
          "OPP:StopPlace:3010016",
          "TEL:StopPlace:03010010",
          "RUT:StopPlace:03010010-6",
          "RUT:StopPlace:03010010",
          "HED:StopPlace:3010016"
        ],
        "__typename": "KeyValues"
      }
    ],
    "quays": [
      {
        "id": "NSR:Quay:1",
        "compassBearing": null,
        "publicCode": "30",
        "description": "Plattform 19 (Trelastgata)",
        "accessibilityAssessment": {
          "limitations": {
            "wheelchairAccess": "TRUE",
            "stepFreeAccess": "TRUE",
            "escalatorFreeAccess": "UNKNOWN",
            "liftFreeAccess": "UNKNOWN",
            "audibleSignalsAvailable": "UNKNOWN",
            "__typename": "AccessibilityLimitations"
          },
          "__typename": "AccessibilityAssessment"
        },
        "importedId": [
          "NSB:Quay:760010030"
        ],
        "keyValues": [
          {
            "key": "uicCode",
            "values": [
              "7600100"
            ],
            "__typename": "KeyValues"
          },
          {
            "key": "imported-id",
            "values": [
              "NSB:Quay:760010030"
            ],
            "__typename": "KeyValues"
          }
        ],
        "privateCode": "30",
        "location": [
          59.909548,
          10.75525
        ],
        "placeEquipments": {
          "generalSign": [
            {
              "id": "NSR:GeneralSign:41427",
              "signContentType": "transportMode",
              "privateCode": {
                "value": "512",
                "__typename": "PrivateCode"
              },
              "__typename": "GeneralSign"
            }
          ],
          "waitingRoomEquipment": null,
          "sanitaryEquipment": null,
          "ticketingEquipment": null,
          "cycleStorageEquipment": null,
          "shelterEquipment": null,
          "__typename": "PlaceEquipments"
        }
      },
      {
        "id": "NSR:Quay:122021",
        "compassBearing": null,
        "publicCode": "31",
        "description": null,
        "accessibilityAssessment": {
          "limitations": {
            "wheelchairAccess": "TRUE",
            "stepFreeAccess": "TRUE",
            "escalatorFreeAccess": "UNKNOWN",
            "liftFreeAccess": "UNKNOWN",
            "audibleSignalsAvailable": "UNKNOWN",
            "__typename": "AccessibilityLimitations"
          },
          "__typename": "AccessibilityAssessment"
        },
        "importedId": [
          "NSB:Quay:760010031"
        ],
        "keyValues": [
          {
            "key": "imported-id",
            "values": [
              "NSB:Quay:760010031"
            ],
            "__typename": "KeyValues"
          }
        ],
        "privateCode": "31",
        "location": [
          59.909487,
          10.755532
        ],
        "placeEquipments": {
          "generalSign": [
            {
              "id": "NSR:GeneralSign:41422",
              "signContentType": "transportMode",
              "privateCode": {
                "value": "512",
                "__typename": "PrivateCode"
              },
              "__typename": "GeneralSign"
            }
          ],
          "waitingRoomEquipment": null,
          "sanitaryEquipment": null,
          "ticketingEquipment": null,
          "cycleStorageEquipment": null,
          "shelterEquipment": null,
          "__typename": "PlaceEquipments"
        }
      },
      {
        "id": "NSR:Quay:122022",
        "compassBearing": null,
        "publicCode": "32",
        "description": null,
        "accessibilityAssessment": {
          "limitations": {
            "wheelchairAccess": "TRUE",
            "stepFreeAccess": "TRUE",
            "escalatorFreeAccess": "UNKNOWN",
            "liftFreeAccess": "UNKNOWN",
            "audibleSignalsAvailable": "UNKNOWN",
            "__typename": "AccessibilityLimitations"
          },
          "__typename": "AccessibilityAssessment"
        },
        "importedId": [
          "NSB:Quay:760010032"
        ],
        "keyValues": [
          {
            "key": "imported-id",
            "values": [
              "NSB:Quay:760010032"
            ],
            "__typename": "KeyValues"
          }
        ],
        "privateCode": "32",
        "location": [
          59.909403,
          10.755875
        ],
        "placeEquipments": {
          "generalSign": [
            {
              "id": "NSR:GeneralSign:41424",
              "signContentType": "transportMode",
              "privateCode": {
                "value": "512",
                "__typename": "PrivateCode"
              },
              "__typename": "GeneralSign"
            }
          ],
          "waitingRoomEquipment": null,
          "sanitaryEquipment": null,
          "ticketingEquipment": null,
          "cycleStorageEquipment": null,
          "shelterEquipment": null,
          "__typename": "PlaceEquipments"
        }
      },
      {
        "id": "NSR:Quay:122023",
        "compassBearing": null,
        "publicCode": "33",
        "description": null,
        "accessibilityAssessment": {
          "limitations": {
            "wheelchairAccess": "TRUE",
            "stepFreeAccess": "TRUE",
            "escalatorFreeAccess": "UNKNOWN",
            "liftFreeAccess": "UNKNOWN",
            "audibleSignalsAvailable": "UNKNOWN",
            "__typename": "AccessibilityLimitations"
          },
          "__typename": "AccessibilityAssessment"
        },
        "importedId": [
          "NSB:Quay:760010033"
        ],
        "keyValues": [
          {
            "key": "imported-id",
            "values": [
              "NSB:Quay:760010033"
            ],
            "__typename": "KeyValues"
          }
        ],
        "privateCode": "33",
        "location": [
          59.909323,
          10.756205
        ],
        "placeEquipments": {
          "generalSign": [
            {
              "id": "NSR:GeneralSign:41415",
              "signContentType": "transportMode",
              "privateCode": {
                "value": "512",
                "__typename": "PrivateCode"
              },
              "__typename": "GeneralSign"
            }
          ],
          "waitingRoomEquipment": null,
          "sanitaryEquipment": null,
          "ticketingEquipment": null,
          "cycleStorageEquipment": null,
          "shelterEquipment": null,
          "__typename": "PlaceEquipments"
        }
      },
      {
        "id": "NSR:Quay:122024",
        "compassBearing": null,
        "publicCode": "34",
        "description": null,
        "accessibilityAssessment": {
          "limitations": {
            "wheelchairAccess": "TRUE",
            "stepFreeAccess": "TRUE",
            "escalatorFreeAccess": "UNKNOWN",
            "liftFreeAccess": "UNKNOWN",
            "audibleSignalsAvailable": "UNKNOWN",
            "__typename": "AccessibilityLimitations"
          },
          "__typename": "AccessibilityAssessment"
        },
        "importedId": [
          "NSB:Quay:760010034"
        ],
        "keyValues": [
          {
            "key": "imported-id",
            "values": [
              "NSB:Quay:760010034"
            ],
            "__typename": "KeyValues"
          }
        ],
        "privateCode": "34",
        "location": [
          59.909224,
          10.75664
        ],
        "placeEquipments": {
          "generalSign": [
            {
              "id": "NSR:GeneralSign:41414",
              "signContentType": "transportMode",
              "privateCode": {
                "value": "512",
                "__typename": "PrivateCode"
              },
              "__typename": "GeneralSign"
            }
          ],
          "waitingRoomEquipment": null,
          "sanitaryEquipment": null,
          "ticketingEquipment": null,
          "cycleStorageEquipment": null,
          "shelterEquipment": null,
          "__typename": "PlaceEquipments"
        }
      },
      {
        "id": "NSR:Quay:98630",
        "compassBearing": null,
        "publicCode": "X",
        "description": "Denne skal sikkert fjernes.",
        "accessibilityAssessment": {
          "limitations": {
            "wheelchairAccess": "TRUE",
            "stepFreeAccess": "TRUE",
            "escalatorFreeAccess": "UNKNOWN",
            "liftFreeAccess": "UNKNOWN",
            "audibleSignalsAvailable": "UNKNOWN",
            "__typename": "AccessibilityLimitations"
          },
          "__typename": "AccessibilityAssessment"
        },
        "importedId": [
          "HED:Quay:301001601",
          "OPP:Quay:301001601"
        ],
        "keyValues": [
          {
            "key": "hpltype",
            "values": [
              "9766"
            ],
            "__typename": "KeyValues"
          },
          {
            "key": "imported-id",
            "values": [
              "HED:Quay:301001601",
              "OPP:Quay:301001601"
            ],
            "__typename": "KeyValues"
          },
          {
            "key": "retn_nett",
            "values": [
              "9769"
            ],
            "__typename": "KeyValues"
          }
        ],
        "privateCode": "1",
        "location": [
          59.909275,
          10.752299
        ],
        "placeEquipments": {
          "generalSign": [
            {
              "id": "NSR:GeneralSign:41423",
              "signContentType": "transportMode",
              "privateCode": {
                "value": "512",
                "__typename": "PrivateCode"
              },
              "__typename": "GeneralSign"
            }
          ],
          "waitingRoomEquipment": null,
          "sanitaryEquipment": null,
          "ticketingEquipment": null,
          "cycleStorageEquipment": null,
          "shelterEquipment": null,
          "__typename": "PlaceEquipments"
        }
      },
      {
        "id": "NSR:Quay:122025",
        "compassBearing": null,
        "publicCode": "35",
        "description": null,
        "accessibilityAssessment": {
          "limitations": {
            "wheelchairAccess": "TRUE",
            "stepFreeAccess": "TRUE",
            "escalatorFreeAccess": "UNKNOWN",
            "liftFreeAccess": "UNKNOWN",
            "audibleSignalsAvailable": "UNKNOWN",
            "__typename": "AccessibilityLimitations"
          },
          "__typename": "AccessibilityAssessment"
        },
        "importedId": [
          "NSB:Quay:760010035"
        ],
        "keyValues": [
          {
            "key": "imported-id",
            "values": [
              "NSB:Quay:760010035"
            ],
            "__typename": "KeyValues"
          }
        ],
        "privateCode": "35",
        "location": [
          59.909165,
          10.7569
        ],
        "placeEquipments": {
          "generalSign": [
            {
              "id": "NSR:GeneralSign:41428",
              "signContentType": "transportMode",
              "privateCode": {
                "value": "512",
                "__typename": "PrivateCode"
              },
              "__typename": "GeneralSign"
            }
          ],
          "waitingRoomEquipment": null,
          "sanitaryEquipment": null,
          "ticketingEquipment": null,
          "cycleStorageEquipment": null,
          "shelterEquipment": null,
          "__typename": "PlaceEquipments"
        }
      },
      {
        "id": "NSR:Quay:116019",
        "compassBearing": null,
        "publicCode": "X",
        "description": "Alternativ transport (Flytoget - Buss) + Her er det kun taxi",
        "accessibilityAssessment": {
          "limitations": {
            "wheelchairAccess": "TRUE",
            "stepFreeAccess": "TRUE",
            "escalatorFreeAccess": "UNKNOWN",
            "liftFreeAccess": "UNKNOWN",
            "audibleSignalsAvailable": "UNKNOWN",
            "__typename": "AccessibilityLimitations"
          },
          "__typename": "AccessibilityAssessment"
        },
        "importedId": [
          "NSB:Quay:760142150",
          "FLY:Quay:760142150"
        ],
        "keyValues": [
          {
            "key": "imported-id",
            "values": [
              "NSB:Quay:760142150",
              "FLY:Quay:760142150"
            ],
            "__typename": "KeyValues"
          }
        ],
        "privateCode": "50",
        "location": [
          59.909704,
          10.752794
        ]
      },
      {
        "id": "NSR:Quay:122026",
        "compassBearing": null,
        "publicCode": "36",
        "description": null,
        "accessibilityAssessment": {
          "limitations": {
            "wheelchairAccess": "TRUE",
            "stepFreeAccess": "TRUE",
            "escalatorFreeAccess": "UNKNOWN",
            "liftFreeAccess": "UNKNOWN",
            "audibleSignalsAvailable": "UNKNOWN",
            "__typename": "AccessibilityLimitations"
          },
          "__typename": "AccessibilityAssessment"
        },
        "importedId": [
          "NSB:Quay:760010036"
        ],
        "keyValues": [
          {
            "key": "imported-id",
            "values": [
              "NSB:Quay:760010036"
            ],
            "__typename": "KeyValues"
          }
        ],
        "privateCode": "36",
        "location": [
          59.909097,
          10.757246
        ],
        "placeEquipments": {
          "generalSign": [
            {
              "id": "NSR:GeneralSign:41421",
              "signContentType": "transportMode",
              "privateCode": {
                "value": "512",
                "__typename": "PrivateCode"
              },
              "__typename": "GeneralSign"
            }
          ],
          "waitingRoomEquipment": null,
          "sanitaryEquipment": null,
          "ticketingEquipment": null,
          "cycleStorageEquipment": null,
          "shelterEquipment": null,
          "__typename": "PlaceEquipments"
        }
      },
      {
        "id": "NSR:Quay:122027",
        "compassBearing": null,
        "publicCode": "37",
        "description": null,
        "accessibilityAssessment": {
          "limitations": {
            "wheelchairAccess": "TRUE",
            "stepFreeAccess": "TRUE",
            "escalatorFreeAccess": "UNKNOWN",
            "liftFreeAccess": "UNKNOWN",
            "audibleSignalsAvailable": "UNKNOWN",
            "__typename": "AccessibilityLimitations"
          },
          "__typename": "AccessibilityAssessment"
        },
        "importedId": [
          "NSB:Quay:760010037"
        ],
        "keyValues": [
          {
            "key": "imported-id",
            "values": [
              "NSB:Quay:760010037"
            ],
            "__typename": "KeyValues"
          }
        ],
        "privateCode": "37",
        "location": [
          59.909021,
          10.757576
        ],
        "placeEquipments": {
          "generalSign": [
            {
              "id": "NSR:GeneralSign:41426",
              "signContentType": "transportMode",
              "privateCode": {
                "value": "512",
                "__typename": "PrivateCode"
              },
              "__typename": "GeneralSign"
            }
          ],
          "waitingRoomEquipment": null,
          "sanitaryEquipment": null,
          "ticketingEquipment": null,
          "cycleStorageEquipment": null,
          "shelterEquipment": null,
          "__typename": "PlaceEquipments"
        }
      },
      {
        "id": "NSR:Quay:122028",
        "compassBearing": null,
        "publicCode": "38",
        "description": null,
        "accessibilityAssessment": {
          "limitations": {
            "wheelchairAccess": "TRUE",
            "stepFreeAccess": "TRUE",
            "escalatorFreeAccess": "UNKNOWN",
            "liftFreeAccess": "UNKNOWN",
            "audibleSignalsAvailable": "UNKNOWN",
            "__typename": "AccessibilityLimitations"
          },
          "__typename": "AccessibilityAssessment"
        },
        "importedId": [
          "NSB:Quay:760010038"
        ],
        "keyValues": [
          {
            "key": "imported-id",
            "values": [
              "NSB:Quay:760010038"
            ],
            "__typename": "KeyValues"
          }
        ],
        "privateCode": "38",
        "location": [
          59.908952,
          10.757847
        ],
        "placeEquipments": {
          "generalSign": [
            {
              "id": "NSR:GeneralSign:41425",
              "signContentType": "transportMode",
              "privateCode": {
                "value": "512",
                "__typename": "PrivateCode"
              },
              "__typename": "GeneralSign"
            }
          ],
          "waitingRoomEquipment": null,
          "sanitaryEquipment": null,
          "ticketingEquipment": null,
          "cycleStorageEquipment": null,
          "shelterEquipment": null,
          "__typename": "PlaceEquipments"
        }
      },
      {
        "id": "NSR:Quay:122029",
        "compassBearing": null,
        "publicCode": "39",
        "description": null,
        "accessibilityAssessment": {
          "limitations": {
            "wheelchairAccess": "TRUE",
            "stepFreeAccess": "TRUE",
            "escalatorFreeAccess": "UNKNOWN",
            "liftFreeAccess": "UNKNOWN",
            "audibleSignalsAvailable": "UNKNOWN",
            "__typename": "AccessibilityLimitations"
          },
          "__typename": "AccessibilityAssessment"
        },
        "importedId": [
          "NSB:Quay:760010039"
        ],
        "keyValues": [
          {
            "key": "imported-id",
            "values": [
              "NSB:Quay:760010039"
            ],
            "__typename": "KeyValues"
          }
        ],
        "privateCode": "39",
        "location": [
          59.908886,
          10.758193
        ],
        "placeEquipments": {
          "generalSign": [
            {
              "id": "NSR:GeneralSign:41418",
              "signContentType": "transportMode",
              "privateCode": {
                "value": "512",
                "__typename": "PrivateCode"
              },
              "__typename": "GeneralSign"
            }
          ],
          "waitingRoomEquipment": null,
          "sanitaryEquipment": null,
          "ticketingEquipment": null,
          "cycleStorageEquipment": null,
          "shelterEquipment": null,
          "__typename": "PlaceEquipments"
        }
      },
      {
        "id": "NSR:Quay:122030",
        "compassBearing": null,
        "publicCode": "40",
        "description": null,
        "accessibilityAssessment": {
          "limitations": {
            "wheelchairAccess": "TRUE",
            "stepFreeAccess": "TRUE",
            "escalatorFreeAccess": "UNKNOWN",
            "liftFreeAccess": "UNKNOWN",
            "audibleSignalsAvailable": "UNKNOWN",
            "__typename": "AccessibilityLimitations"
          },
          "__typename": "AccessibilityAssessment"
        },
        "importedId": [
          "NSB:Quay:760010040"
        ],
        "keyValues": [
          {
            "key": "imported-id",
            "values": [
              "NSB:Quay:760010040"
            ],
            "__typename": "KeyValues"
          }
        ],
        "privateCode": "40",
        "location": [
          59.908823,
          10.758555
        ],
        "placeEquipments": {
          "generalSign": [
            {
              "id": "NSR:GeneralSign:41420",
              "signContentType": "transportMode",
              "privateCode": {
                "value": "512",
                "__typename": "PrivateCode"
              },
              "__typename": "GeneralSign"
            }
          ],
          "waitingRoomEquipment": null,
          "sanitaryEquipment": null,
          "ticketingEquipment": null,
          "cycleStorageEquipment": null,
          "shelterEquipment": null,
          "__typename": "PlaceEquipments"
        }
      },
      {
        "id": "NSR:Quay:122031",
        "compassBearing": null,
        "publicCode": "41",
        "description": null,
        "accessibilityAssessment": {
          "limitations": {
            "wheelchairAccess": "TRUE",
            "stepFreeAccess": "TRUE",
            "escalatorFreeAccess": "UNKNOWN",
            "liftFreeAccess": "UNKNOWN",
            "audibleSignalsAvailable": "UNKNOWN",
            "__typename": "AccessibilityLimitations"
          },
          "__typename": "AccessibilityAssessment"
        },
        "importedId": [
          "NSB:Quay:760010041"
        ],
        "keyValues": [
          {
            "key": "imported-id",
            "values": [
              "NSB:Quay:760010041"
            ],
            "__typename": "KeyValues"
          }
        ],
        "privateCode": "41",
        "location": [
          59.90873,
          10.759183
        ],
        "placeEquipments": {
          "generalSign": [
            {
              "id": "NSR:GeneralSign:41417",
              "signContentType": "transportMode",
              "privateCode": {
                "value": "512",
                "__typename": "PrivateCode"
              },
              "__typename": "GeneralSign"
            }
          ],
          "waitingRoomEquipment": null,
          "sanitaryEquipment": null,
          "ticketingEquipment": null,
          "cycleStorageEquipment": null,
          "shelterEquipment": null,
          "__typename": "PlaceEquipments"
        }
      },
      {
        "id": "NSR:Quay:122032",
        "compassBearing": null,
        "publicCode": "42",
        "description": null,
        "accessibilityAssessment": {
          "limitations": {
            "wheelchairAccess": "TRUE",
            "stepFreeAccess": "TRUE",
            "escalatorFreeAccess": "UNKNOWN",
            "liftFreeAccess": "UNKNOWN",
            "audibleSignalsAvailable": "UNKNOWN",
            "__typename": "AccessibilityLimitations"
          },
          "__typename": "AccessibilityAssessment"
        },
        "importedId": [
          "NSB:Quay:760010042"
        ],
        "keyValues": [
          {
            "key": "imported-id",
            "values": [
              "NSB:Quay:760010042"
            ],
            "__typename": "KeyValues"
          }
        ],
        "privateCode": "42",
        "location": [
          59.908695,
          10.759459
        ],
        "placeEquipments": {
          "generalSign": [
            {
              "id": "NSR:GeneralSign:41419",
              "signContentType": "transportMode",
              "privateCode": {
                "value": "512",
                "__typename": "PrivateCode"
              },
              "__typename": "GeneralSign"
            }
          ],
          "waitingRoomEquipment": null,
          "sanitaryEquipment": null,
          "ticketingEquipment": null,
          "cycleStorageEquipment": null,
          "shelterEquipment": null,
          "__typename": "PlaceEquipments"
        }
      },
      {
        "id": "NSR:Quay:122033",
        "compassBearing": null,
        "publicCode": "43",
        "description": null,
        "accessibilityAssessment": {
          "limitations": {
            "wheelchairAccess": "TRUE",
            "stepFreeAccess": "TRUE",
            "escalatorFreeAccess": "UNKNOWN",
            "liftFreeAccess": "UNKNOWN",
            "audibleSignalsAvailable": "UNKNOWN",
            "__typename": "AccessibilityLimitations"
          },
          "__typename": "AccessibilityAssessment"
        },
        "importedId": [
          "NSB:Quay:760010043"
        ],
        "keyValues": [
          {
            "key": "imported-id",
            "values": [
              "NSB:Quay:760010043"
            ],
            "__typename": "KeyValues"
          }
        ],
        "privateCode": "43",
        "location": [
          59.908652,
          10.759818
        ],
        "placeEquipments": {
          "generalSign": [
            {
              "id": "NSR:GeneralSign:41416",
              "signContentType": "transportMode",
              "privateCode": {
                "value": "512",
                "__typename": "PrivateCode"
              },
              "__typename": "GeneralSign"
            }
          ],
          "waitingRoomEquipment": null,
          "sanitaryEquipment": null,
          "ticketingEquipment": null,
          "cycleStorageEquipment": null,
          "shelterEquipment": null,
          "__typename": "PlaceEquipments"
        }
      }
    ],
    "entrances": [],
    "pathJunctions": [],
    "parking": []
  },
  {
    "id": "NSR:StopPlace:21",
    "name": "Drammen",
    "alternativeNames": [],
    "stopPlaceType": "onstreetBus",
    "isActive": true,
    "version": "6",
    "hasExpired": false,
    "transportMode": "bus",
    "submode": "railReplacementBus",
    "tags": [],
    "topographicPlace": "Drammen",
    "parentTopographicPlace": "Buskerud",
    "validBetween": {
      "fromDate": "2017-08-25T10:15:01.000+0200",
      "toDate": null,
      "__typename": "ValidBetween"
    },
    "tariffZones": [],
    "accessibilityAssessment": {
      "limitations": {
        "wheelchairAccess": "TRUE",
        "stepFreeAccess": "TRUE",
        "escalatorFreeAccess": "UNKNOWN",
        "liftFreeAccess": "UNKNOWN",
        "audibleSignalsAvailable": "UNKNOWN",
        "__typename": "AccessibilityLimitations"
      },
      "__typename": "AccessibilityAssessment"
    },
    "location": [
      59.739828,
      10.204365
    ],
    "importedId": [
      "NSB:StopPlace:760142130"
    ],
    "keyValues": [
      {
        "key": "jbvCode",
        "values": [
          "DRM"
        ],
        "__typename": "KeyValues"
      },
      {
        "key": "uicCode",
        "values": [
          "7601421"
        ],
        "__typename": "KeyValues"
      },
      {
        "key": "iffCode",
        "values": [
          "7601421"
        ],
        "__typename": "KeyValues"
      },
      {
        "key": "lisaId",
        "values": [
          "1421"
        ],
        "__typename": "KeyValues"
      },
      {
        "key": "imported-id",
        "values": [
          "NSB:StopPlace:760142130"
        ],
        "__typename": "KeyValues"
      }
    ],
    "quays": [
      {
        "id": "NSR:Quay:38",
        "compassBearing": null,
        "publicCode": null,
        "description": "Alternativ transport (NSB)",
        "accessibilityAssessment": {
          "limitations": {
            "wheelchairAccess": "TRUE",
            "stepFreeAccess": "TRUE",
            "escalatorFreeAccess": "UNKNOWN",
            "liftFreeAccess": "UNKNOWN",
            "audibleSignalsAvailable": "UNKNOWN",
            "__typename": "AccessibilityLimitations"
          },
          "__typename": "AccessibilityAssessment"
        },
        "importedId": [
          "NSB:Quay:760142130"
        ],
        "keyValues": [
          {
            "key": "uicCode",
            "values": [
              "7601421"
            ],
            "__typename": "KeyValues"
          },
          {
            "key": "imported-id",
            "values": [
              "NSB:Quay:760142130"
            ],
            "__typename": "KeyValues"
          }
        ],
        "location": [
          59.739961,
          10.20436
        ]
      },
      {
        "id": "NSR:Quay:106020",
        "compassBearing": null,
        "publicCode": "X",
        "description": "Alternativ transport (Flytoget)",
        "accessibilityAssessment": {
          "limitations": {
            "wheelchairAccess": "TRUE",
            "stepFreeAccess": "TRUE",
            "escalatorFreeAccess": "UNKNOWN",
            "liftFreeAccess": "UNKNOWN",
            "audibleSignalsAvailable": "UNKNOWN",
            "__typename": "AccessibilityLimitations"
          },
          "__typename": "AccessibilityAssessment"
        },
        "importedId": [
          "NSB:Quay:760142150",
          "FLY:Quay:760142150"
        ],
        "keyValues": [
          {
            "key": "imported-id",
            "values": [
              "NSB:Quay:760142150",
              "FLY:Quay:760142150"
            ],
            "__typename": "KeyValues"
          }
        ],
        "privateCode": "50",
        "location": [
          59.740351,
          10.202326
        ]
      }
    ],
    "entrances": [],
    "pathJunctions": [],
    "parking": []
  },
  {
    "id": "FAKE_ID",
    "name": "Oslo S",
    "alternativeNames": [],
    "stopPlaceType": "onstreetBus",
    "isActive": true,
    "version": "17",
    "hasExpired": false,
    "transportMode": "bus",
    "submode": "railReplacementBus",
    "tags": [
      {
        "name": "adm_navn",
        "comment": "Navn evt. ikke i henhold til hndbok eller har andre skrivefeil",
        "created": "2017-09-26T18:07:09.990+0200",
        "createdBy": "johan",
        "idReference": "NSR:StopPlace:2",
        "__typename": "Tag"
      }
    ],
    "topographicPlace": "Oslo",
    "parentTopographicPlace": "Oslo",
    "validBetween": {
      "fromDate": "2017-09-26T19:23:40.000+0200",
      "toDate": null,
      "__typename": "ValidBetween"
    },
    "tariffZones": [
      {
        "name": "1",
        "id": "RUT:TariffZone:1"
      }
    ],
    "accessibilityAssessment": {
      "limitations": {
        "wheelchairAccess": "TRUE",
        "stepFreeAccess": "TRUE",
        "escalatorFreeAccess": "UNKNOWN",
        "liftFreeAccess": "UNKNOWN",
        "audibleSignalsAvailable": "UNKNOWN",
        "__typename": "AccessibilityLimitations"
      },
      "__typename": "AccessibilityAssessment"
    },
    "location": [
      59.90965,
      10.754923
    ],
    "importedId": [
      "RUT:StopPlace:3010010-6",
      "TEL:StopPlace:3010010",
      "NSB:StopPlace:760010031",
      "OPP:StopPlace:3010016",
      "TEL:StopPlace:03010010",
      "RUT:StopPlace:03010010-6",
      "RUT:StopPlace:03010010",
      "HED:StopPlace:3010016"
    ],
    "keyValues": [
      {
        "key": "jbvCode",
        "values": [
          "OSL"
        ],
        "__typename": "KeyValues"
      },
      {
        "key": "uicCode",
        "values": [
          "7600100"
        ],
        "__typename": "KeyValues"
      },
      {
        "key": "iffCode",
        "values": [
          "7600100"
        ],
        "__typename": "KeyValues"
      },
      {
        "key": "lisaId",
        "values": [
          "100"
        ],
        "__typename": "KeyValues"
      },
      {
        "key": "imported-id",
        "values": [
        ],
        "__typename": "KeyValues"
      }
    ],
    "quays": [],
    "entrances": [],
    "pathJunctions": [],
    "parking": []
  }
]