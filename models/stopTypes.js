const stopTypes = {
    "nb" : [
      {
        name: "Busstopp",
        value: "onstreetBus",
        quayItemName: 'platform'
      }, {
        name: "Trikkestopp",
        value: "onstreetTram",
        quayItemName: 'platform'
      }, {
        name: "Flyplass",
        value: "airport",
        quayItemName: 'gate'
      }, {
        name: "Togstopp",
        value: "railStation",
        quayItemName: 'track'
      }, {
        name: "T-banestopp",
        value: "metroStation",
        quayItemName: 'track'
      }, {
        name: "Bussterminal",
        value: "busStation",
        quayItemName: 'plattform'
      }, {
        name: "Bilferjekai",
        value: "harbourPort",
        quayItemName: 'kai'
      }, {
        name: "Passasjerbåtkai",
        value: "ferryStop",
        quayItemName: 'kai'
      }, {
        name: "Kabelbanestopp",
        value: "liftStation",
        quayItemName: 'plattform'
      }
    ],

    "en" : [
      {
        name: "Bus stop",
        value: "onstreetBus",
        quayItemName: 'platform'
      }, {
        name: "City tram",
        value: "onstreetTram",
        quayItemName: 'platform'
      }, {
        name: "Airport",
        value: "airport",
        quayItemName: 'gate'
      }, {
        name: "Rail station",
        value: "railStation",
        quayItemName: 'track'
      }, {
        name: "Metro stop",
        quayItemName: 'track',
        value: "metroStation"
      }, {
        name: "Bus terminal",
        value: "busStation",
        quayItemName: 'platform'
      }, {
        name: "Harbour port",
        value: "harbourPort",
        quayItemName: 'port'
      }, {
        name: "Ferry stop",
        value: "ferryStop",
        quayItemName: 'port'
      }, {
        name: "Lift station",
        value: "liftStation",
        quayItemName: 'platform'
      }
    ]
  }


  export default stopTypes
