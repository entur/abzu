const leafletConfig = {
  layers : {
    "local_map": {
      "name": "Rutebankens kart",
      "url": "https://test.rutebanken.org/api/map/1.0/{z}/{x}/{y}.png",
      "type": "xyz"
    },
    "google_hybrid": {
      "name": "Google Hybrid",
      "layerType": "HYBRID",
      "type": "google"
    },
    "osm": {
      "name": "OpenStreetMap",
      "url": "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      "type": "xyz"
    }
  }
}

export default leafletConfig
