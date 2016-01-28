'use strict';

angular.module("abzu.service").factory('stopPlaceTypeService', [function() {

	var stopPlaceTypes = [
		{ name : "Buss	topp", value: "onstreetBus"},
		{ name : "Trikkeholdeplass", value: "onstreetTram"},
		{ name : "Flyplass", value: "airport"},
		{ name : "Togstasjon", value: "railStation"},
		{ name : "T-banestasjon", value: "metroStation"},
		{ name : "Busstasjon", value: "busStation"},
		{ name : "Bussterminal", value: "coachStation"},
		{ name : "Trikkestasjon", value: "tramStation"},
		{ name : "Kai", value: "harbourPort"},
		{ name : "Fergekai", value: "ferryPort"},
		{ name : "Fergestopp", value: "ferryStop"},
		{ name : "Gondolbanestasjon", value: "liftStation"},
		{ name : "Overgang buss tog", value: "vehicleRailInterchange"},
		{ name : "Annet", value: "other"}
	];

	function getStopPlaceTypes() {
		return stopPlaceTypes;
	};

	function getStopPlaceTypeNameFromValue(stopTypeValue) {
		for(var i in stopPlaceTypes) {
			if(stopTypeValue) {
				if(stopPlaceTypes[i].value === stopTypeValue) {
					return stopPlaceTypes[i].name;
				}
			}
		}
		return null;
	};

	return {
		getStopPlaceTypeNameFromValue: getStopPlaceTypeNameFromValue,
		getStopPlaceTypes: getStopPlaceTypes
	}
}]);
