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
          name: 'Erstatningsbus',
          value: 'railReplacementBus'
        },
        {
          name: 'Lokalbuss',
          value: 'localBus'
        },
        {
          name: 'Regional bussrute',
          value: 'regionalBus'
        },
        {
          name: 'Ekspressbuss',
          value: 'expressBus'
        },
        {
          name: 'Nattbuss',
          value: 'nightBus'
        },
        {
          name: 'Skolerute',
          value: 'schoolBus'
        },
        {
          name: 'Shufflebuss',
          value: 'shuttleBus'
        },
        {
          name: 'Turistbus',
          value: 'sightseeingBus'
        },
        {
          name: 'Flybuss',
          value: 'airportLinkBus'
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
          value: 'local',
          name: 'Lokaltog'
        },
        {
          value: 'regionalRail',
          name: 'Regiontog (RT)'
        },
        {
          value: 'internationalRail',
          name: 'Internasjonal jernbane'
        },
        {
          value: 'interregionalRail',
          name: 'Regiontog (DT)'
        },

        {
          value: 'longDistance',
          name: 'Intercity (IC)'
        },
        {
          value: 'nightRail',
          name: 'Nattog'
        },
        {
          value: 'touristRailway',
          name: 'Museumtog'
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
          value: 'highSpeedPassengerService',
          name: 'Hurtigbåt'
        },
        {
          value: 'highSpeedVehicleService',
          name: 'Kombibåt'
        },
        {
          value: 'internationalCarFerry',
          name: 'Internasjonal passsjerbåt'
        },
        {
          value: 'localCarFerry',
          name: 'Innenriks bilferje'
        },
        {
          value: 'nationalCarFerry',
          name: 'Hurtigruten'
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
          value: 'highSpeedPassengerService',
          name: 'Hurtigbåt'
        },
        {
          value: 'highSpeedVehicleService',
          name: 'Kombibåt'
        },
        {
          value: 'internationalPassengerFerry',
          name: 'Internasjonal passasjerbåt'
        },
        {
          value: 'localPassengerFerry',
          name: 'Innenriks bilferje'
        },
        {
          value: 'sightseeingService',
          name: 'Turistbåtrute'
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
          name: 'Rail replacement bus',
          value: 'railReplacementBus'
        },
        {
          name: 'Local bus',
          value: 'localBus'
        },
        {
          name: 'Regional bus',
          value: 'regionalBus'
        },
        {
          name: 'Express bus',
          value: 'expressBus'
        },
        {
          name: 'Night bus',
          value: 'nightBus'
        },
        {
          name: 'School bus',
          value: 'schoolBus'
        },
        {
          name: 'Shuttle bus',
          value: 'shuttleBus'
        },
        {
          name: 'Sightseeing bus',
          value: 'sightseeingBus'
        },
        {
          name: 'Airport Link bus',
          value: 'airportLinkBus'
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
          value: 'internationalFlight',
          name: 'International flight'
        },
        {
          value: 'helicopterService',
          name: 'Helicopter service'
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
          value: 'local',
          name: 'Local train'
        },
        {
          value: 'regionalRail',
          name: 'Regional train'
        },
        {
          value: 'internationalRail',
          name: 'International rail'
        },
        {
          value: 'interregionalRail',
          name: 'Interregional rail'
        },

        {
          value: 'longDistance',
          name: 'Long distance train'
        },
        {
          value: 'nightRail',
          name: 'Night rail'
        },
        {
          value: 'touristRailway',
          name: 'Tourist railway'
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
          value: 'highSpeedPassengerService',
          name: 'High speed passenger service'
        },
        {
          value: 'highSpeedVehicleService',
          name: 'High speed vehicle service'
        },
        {
          value: 'internationalCarFerry',
          name: 'International car ferry'
        },
        {
          value: 'localCarFerry',
          name: 'Local car ferry'
        },
        {
          value: 'nationalCarFerry',
          name: 'National car ferry'
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

export default stopTypes;
