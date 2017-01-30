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
        quayItemName: 'platform'
      }, {
        name: "Bilferjekai",
        value: "harbourPort",
        quayItemName: 'port'
      }, {
        name: "Passasjerbåtkai",
        value: "ferryStop",
        quayItemName: 'port'
      }, {
        name: "Kabelbanestopp",
        value: "liftStation",
        quayItemName: null
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
        quayItemName: null
      }
    ]
  }


  export default stopTypes
