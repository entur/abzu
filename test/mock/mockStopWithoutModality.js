export default {
  data: {
    __typename: 'StopPlaceRegister',
    pathLink: [],
    stopPlace: [
      {
        __typename: 'StopPlace',
        id: 'NSR:StopPlace:58351',
        name: null,
        alternativeNames: [],
        description: null,
        geometry: {
          coordinates: [[10.399077, 63.43604]],
          __typename: 'GeoJSON'
        },
        quays: [
          {
            id: 'NSR:Quay:98580',
            geometry: {
              coordinates: [[10.399077, 63.43604]],
              __typename: 'GeoJSON'
            },
            version: '21',
            compassBearing: null,
            publicCode: '2',
            privateCode: { value: '2', __typename: 'PrivateCode' },
            description: {
              value: '',
              __typename: 'EmbeddableMultilingualString'
            },
            keyValues: [
              { key: 'hpltype', values: ['9767'], __typename: 'KeyValues' },
              {
                key: 'imported-id',
                values: ['HED:Quay:1601126002', 'OPP:Quay:1601126002'],
                __typename: 'KeyValues'
              },
              { key: 'retn_nett', values: ['9771'], __typename: 'KeyValues' }
            ],
            accessibilityAssessment: null,
            placeEquipments: {
              generalSign: null,
              waitingRoomEquipment: null,
              sanitaryEquipment: null,
              ticketingEquipment: null,
              cycleStorageEquipment: null,
              shelterEquipment: [
                {
                  seats: null,
                  stepFree: null,
                  enclosed: true,
                  __typename: 'ShelterEquipment'
                }
              ],
              __typename: 'PlaceEquipments'
            },
            __typename: 'Quay'
          }
        ],
        tags: [],
        weighting: null,
        stopPlaceType: null,
        submode: null,
        transportMode: null,
        version: '1',
        keyValues: [],
        tariffZones: [],
        topographicPlace: {
          name: {
            value: 'Trondheim',
            __typename: 'EmbeddableMultilingualString'
          },
          parentTopographicPlace: {
            name: {
              value: 'Sør-Trøndelag',
              __typename: 'EmbeddableMultilingualString'
            },
            __typename: 'TopographicPlace'
          },
          topographicPlaceType: 'municipality',
          __typename: 'TopographicPlace'
        },
        accessibilityAssessment: {
          limitations: {
            wheelchairAccess: 'UNKNOWN',
            stepFreeAccess: 'UNKNOWN',
            escalatorFreeAccess: 'UNKNOWN',
            liftFreeAccess: 'UNKNOWN',
            audibleSignalsAvailable: 'UNKNOWN',
            __typename: 'AccessibilityLimitations'
          },
          __typename: 'AccessibilityAssessment'
        },
        placeEquipments: null,
        validBetween: {
          fromDate: '2017-10-04T10:12:06.313+0200',
          toDate: null,
          __typename: 'ValidBetween'
        }
      }
    ],
    parking: [],
    versions: [
      {
        id: 'NSR:StopPlace:58351',
        validBetween: {
          fromDate: '2017-10-04T10:12:06.313+0200',
          toDate: null,
          __typename: 'ValidBetween'
        },
        name: null,
        version: '1',
        versionComment: 'Flyttet NSR:Quay:98580 fra NSR:StopPlace:41742',
        changedBy: 'seantest',
        __typename: 'StopPlace'
      }
    ]
  }
};
