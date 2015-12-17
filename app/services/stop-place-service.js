'use strict';

angular.module("abzu.service").factory('stopPlaceService', ['$http', 'appConfig', function($http, config) {

	if(!config.tiamat || !config.tiamat.baseUrl) {
		console.log("Expected configuration config.tiamat.baseUrl");
	}

	function getStopPlaces() {
		return $http.get(config.tiamat.baseUrl+'/stop_place').
	    	then(function(data) {
				return data.data; 
	    	});
	};

	function getStopPlacesWithin(boundingBox) {
		return $http.post(config.tiamat.baseUrl+'/stop_place/search', boundingBox).
        	then(function(data) {
				return data.data;
        	});
	};

	function getStopPlace(stopPlaceId) {
		return $http.get(config.tiamat.baseUrl+'/stop_place/'+stopPlaceId).
        	then(function(data) {
				return data.data; 
        	});
	};

	function saveStopPlace(stopPlace) {
		console.log("saving stop place "+stopPlace.id);
		console.log(stopPlace);
		return $http.post(config.tiamat.baseUrl+'/stop_place/'+stopPlace.id, stopPlace).
        	then(function(data) {
				return data.data; 
        	});
	};


	function findStopPlacesByName(name) {
		return $http.get(config.tiamat.baseUrl+'/stop_place?name='+name).
        	then(function(data) {
				return data.data;
        	});
	};

	return {
		getStopPlaces: getStopPlaces,
		findStopPlacesByName: findStopPlacesByName,
		getStopPlacesWithin: getStopPlacesWithin,
		getStopPlace: getStopPlace,
		saveStopPlace: saveStopPlace
	}

}]);