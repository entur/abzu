'use strict';

angular.module("abzu.service", []).factory('stopPlaceService', ['$http', function($http) {


	 function getStopPlaces() {
		
		return $http.get('http://localhost:1871/jersey/stop_place').
        	then(function(data) {
        		console.log(data.data);
				return data.data; 
        	});
	};

	return {
		getStopPlaces: getStopPlaces
	}

}]);