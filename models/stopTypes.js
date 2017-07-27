const stopTypes = {
  nb: [
    {
      name: 'Busstopp',
      value: 'onstreetBus',
      quayItemName: 'platform',
      transportMode: 'bus',
      submodes: [
        {
          name: 'Ikke spesifisert',
          value: null
        },
        {
          name: "Ekspressbuss",
          value: "expressBus"
        },
        {
          name: "Erstatningsbuss",
          value: "railReplacementBus"
        },
        {
          name: "Flybuss",
          value: "airportLinkBus"
        },
        {
          name: "Lokalbuss",
          value: "localBus"
        },
        {
          name: "Nattbuss",
          value: "nightBus"
        },
        {
          name: "Regional bussrute",
          value: "regionalBus"
        },
        {
          name: "Shuttlebuss",
          value: "shuttleBus"
        },
        {
          name: "Skolerute",
          value: "schoolBus"
        },
        {
          name: "Turistbuss",
          value: "sightseeingBus"
        }
      ]
    },
    {
      name: 'Bussterminal',
      value: 'busStation',
      quayItemName: 'platform'
    },
    {
      name: 'Bilferjekai',
      value: 'harbourPort',
      quayItemName: 'port',
      transportMode: 'water',
      submodes: [
        {
          name: 'Ikke spesifisert',
          value: null
        },
        {
          value: "highSpeedPassengerService",
          name: "Hurtigbåt"
        },
        {
          value: "nationalCarFerry",
          name: "Hurtigruten"
        },
        {
          value: "localCarFerry",
          name: "Innenriks bilferje"
        },
        {
          value: "internationalCarFerry",
          name: "Internasjonal passsjerbåt"
        },
        {
          value: "highSpeedVehicleService",
          name: "Kombibåt"
        }
      ]
    },
    {
      name: 'Passasjerbåtkai',
      value: 'ferryStop',
      quayItemName: 'port',
      transportMode: 'water',
      submodes: [
        {
          name: 'Ikke spesifisert',
          value: null
        },
        {
          value: "highSpeedPassengerService",
          name: "Hurtigbåt"
        },
        {
          value: "localPassengerFerry",
          name: "Innenriks bilferje"
        },
        {
          value: "internationalPassengerFerry",
          name: "Internasjonal passasjerbåt"
        },
        {
          value: "highSpeedVehicleService",
          name: "Kombibåt"
        },
        {
          value: "sightseeingService",
          name: "Turistbåtrute"
        }
      ]
    },
    {
      name: 'Togstopp',
      value: 'railStation',
      quayItemName: 'track',
      transportMode: 'rail',
      submodes: [
        {
          name: 'Ikke spesifisert',
          value: null
        },
        {
          value: "longDistance",
          name: "Intercity (IC)"
        },
        {
          value: "internationalRail",
          name: "Internasjonal jernbane"
        },
        {
          value: "local",
          name: "Lokaltog"
        },
        {
          value: "touristRailway",
          name: "Museumtog"
        },
        {
          value: "nightRail",
          name: "Nattog"
        },
        {
          value: "interregionalRail",
          name: "Regiontog (DT)"
        },
        {
          value: "regionalRail",
          name: "Regiontog (RT)"
        }
      ]
    },
    {
      name: 'Trikkestopp',
      value: 'onstreetTram',
      quayItemName: 'platform',
      transportMode: 'tram',
      submodes: [
        {
          name: 'Ikke spesifisert',
          value: null
        },
        {
          value: 'localTram',
          name: 'Sporvogn'
        }
      ]
    },
    {
      name: 'T-banestopp',
      value: 'metroStation',
      quayItemName: 'track',
      transportMode: 'metro',
      submodes: [
        {
          name: 'Ikke spesifisert',
          value: null
        },
        {
          name: 'T-bane',
          value: 'metro'
        }
      ]
    },
    {
      name: 'Flyplass',
      value: 'airport',
      transportMode: 'air',
      quayItemName: 'gate',
      submodes: [
        {
          name: 'Ikke spesifisert',
          value: null
        },
        {
          value: 'domesticFlight',
          name: 'Innenriks flyrute'
        },
        {
          value: 'internationalFlight',
          name: 'Internasjonell flyrute'
        },
        {
          value: 'helicopterService',
          name: 'Helikopterrute'
        }
      ]
    },
    {
      name: 'Kabelbanestopp',
      value: 'liftStation',
      quayItemName: 'platform',
      transportMode: 'cableway',
      submodes: [
        {
          name: 'Ikke spesifisert',
          value: null
        },
        {
          name: 'Taubane',
          value: 'telecabin'
        }
      ]
    }
  ],

  en: [
    {
      name: 'Bus stop',
      value: 'onstreetBus',
      quayItemName: 'platform',
      submodes: [
        {
          name: 'Not specified',
          value: null
        },
        {
          name: "Airport Link bus",
          value: "airportLinkBus"
        },
        {
          name: "Express bus",
          value: "expressBus"
        },
        {
          name: "Local bus",
          value: "localBus"
        },
        {
          name: "Night bus",
          value: "nightBus"
        },
        {
          name: "Rail replacement bus",
          value: "railReplacementBus"
        },
        {
          name: "Regional bus",
          value: "regionalBus"
        },
        {
          name: "School bus",
          value: "schoolBus"
        },
        {
          name: "Shuttle bus",
          value: "shuttleBus"
        },
        {
          name: "Sightseeing bus",
          value: "sightseeingBus"
        }
      ]
    },
    {
      name: 'Bus terminal',
      value: 'busStation',
      quayItemName: 'platform'
    },
    {
      name: 'Harbour port',
      value: 'harbourPort',
      quayItemName: 'port',
      transportMode: 'water',
      submodes: [
        {
          name: 'Not specified',
          value: null
        },
        {
          value: "highSpeedPassengerService",
          name: "High speed passenger service"
        },
        {
          value: "highSpeedVehicleService",
          name: "High speed vehicle service"
        },
        {
          value: "internationalCarFerry",
          name: "International car ferry"
        },
        {
          value: "localCarFerry",
          name: "Local car ferry"
        },
        {
          value: "nationalCarFerry",
          name: "National car ferry"
        }
      ]
    },
    {
      name: 'Ferry stop',
      value: 'ferryStop',
      quayItemName: 'port',
      transportMode: 'water',
      submodes: [
        {
          name: 'Not specified',
          value: null
        },
        {
          value: 'highSpeedPassengerService',
          name: 'High speed passenger service'
        },
        {
          value: 'highSpeedVehicleService',
          name: 'High speed vehicle service'
        },
        {
          value: 'internationalPassengerFerry',
          name: 'International passenger ferry'
        },
        {
          value: 'localPassengerFerry',
          name: 'Local passenger ferry'
        },
        {
          value: 'sightseeingService',
          name: 'Sightseeing service'
        }
      ]
    },
    {
      name: 'Rail station',
      value: 'railStation',
      quayItemName: 'track',
      transportMode: 'rail',
      submodes: [
        {
          name: 'Not specified',
          value: null
        },
        {
          value: "internationalRail",
          name: "International rail"
        },
        {
          value: "interregionalRail",
          name: "Interregional rail"
        },
        {
          value: "local",
          name: "Local train"
        },
        {
          value: "longDistance",
          name: "Long distance train"
        },
        {
          value: "nightRail",
          name: "Night rail"
        },
        {
          value: "regionalRail",
          name: "Regional train"
        },
        {
          value: "touristRailway",
          name: "Tourist railway"
        }
      ]
    },
    {
      name: 'City tram',
      value: 'onstreetTram',
      transportMode: 'tram',
      quayItemName: 'platform',
      submodes: [
        {
          name: 'Not specified',
          value: null
        },
        {
          value: 'localTram',
          name: 'Local tram'
        }
      ]
    },
    {
      name: 'Metro stop',
      quayItemName: 'track',
      value: 'metroStation',
      transportMode: 'metro',
      submodes: [
        {
          name: 'Not specified',
          value: null
        },
        {
          name: 'Metro',
          value: 'metro'
        }
      ]
    },
    {
      name: 'Airport',
      value: 'airport',
      transportMode: 'air',
      quayItemName: 'gate',
      submodes: [
        {
          name: 'Not specified',
          value: null
        },
        {
          value: 'domesticFlight',
          name: 'Domestic flight'
        },
        {
          value: 'helicopterService',
          name: 'Helicopter service'
        },
        {
          value: 'internationalFlight',
          name: 'International flight'
        }
      ]
    },
    {
      name: 'Lift station',
      value: 'liftStation',
      quayItemName: 'platform',
      transportMode: 'cableway',
      submodes: [
        {
          name: 'Not specified',
          value: null
        },
        {
          name: 'Telecabin',
          value: 'telecabin'
        }
      ]
    }
  ]
};

export const unknownStopPlaceType = {
  nb: 'Modalitet ikke satt',
  en: 'Modality not defined'
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
  "funicular"
];

export default stopTypes;
