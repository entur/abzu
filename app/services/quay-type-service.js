'use strict';

angular.module("abzu.service").factory('quayTypeService', [function() {

  var quayTypes = [{
	    name: "Gate",
	    value: "airlineGate"
	  }, {
	    name: "Togperrong",
	    value: "railPlatform"
	  }, {
	    name: "T-baneperrong",
	    value: "metroPlatform"
	  }, {
	    name: "Turbussstopp",
	    value: "coachStop"
	  }, {
	    name: "Busstopp",
	    value: "busStop"
	  }, {
	    name: "Busslomme",
	    value: "busBay"
	  }, {
	    name: "Trikkeperrong",
	    value: "tramPlatform"
	  }, {
	    name: "Trikkestopp",
	    value: "tramStop"
	  }, {
	    name: "Brygge",
	    value: "boatQuay"
	  }, {
	    name: "Fergekai",
	    value: "ferryLanding"
	  }, {
	    name: "Taubaneplattform",
	    value: "telecabinePlatform"
	  }, {
	    name: "Taxiholdeplass",
	    value: "taxiStand"
	  }, {
	    name: "Avlessningsplass",
	    value: "setDownPlace"
	  }, {
	    name: "Pålessingsplass",
	    value: "vehicleLoadingPlace"
	  }, {
	    name: "Annet",
	    value: "other"
  	}
	];

  function getQuayTypes() {
    return quayTypes;
  };

  function getQuayTypeNameFromValue(quayTypeValue) {
    for (var i in quayTypes) {
      if (quayTypeValue && quayTypes[i].value === quayTypeValue) {
        return stopPlaceTypes[i].name;
      }
    }
    return null;
  };

  return {
    getQuayTypeNameFromValue: getQuayTypeNameFromValue,
    getQuayTypes: getQuayTypes
  }
}]);
