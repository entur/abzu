'use strict';

angular.module("abzu.service").factory('stopPlaceService', ['$http', function($http) {

	console.log("Setting up stopPlaceService");

	function getStopPlaces() {
				console.log("get stop places");

		return $http.get('http://localhost:1871/jersey/stop_place').
        	then(function(data) {
				return data.data; 
        	});
	};

	function getStopPlace(stopPlaceId) {
		return $http.get('http://localhost:1871/jersey/stop_place/'+stopPlaceId).
        	then(function(data) {
				return data.data; 
        	});
	};

	function saveStopPlace(stopPlace) {
		console.log("saving stop place "+stopPlace.id);
		console.log(stopPlace);
		return $http.post('http://localhost:1871/jersey/stop_place/'+stopPlace.id, stopPlace).
        	then(function(data) {
				return data.data; 
        	});
	};


	function findStopPlacesByName(name) {
		return $http.get('http://localhost:1871/jersey/stop_place?name='+name).
        	then(function(data) {
				return data.data;
        	});
	};

	return {
		getStopPlaces: getStopPlaces,
		findStopPlacesByName: findStopPlacesByName,
		getStopPlace: getStopPlace,
		saveStopPlace: saveStopPlace
	}

}]);