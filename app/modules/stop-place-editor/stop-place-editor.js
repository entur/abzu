'use strict';

angular.module('abzu.stopPlaceEditor', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/stopPlaceEditor/:stopPlaceId', {
    templateUrl: 'modules/stop-place-editor/stop-place-editor.html',
    controller: 'StopPlaceEditorCtrl'
  });
}])

.controller('StopPlaceEditorCtrl', ['$window', '$routeParams', '$scope', 'stopPlaceService', 'stopPlaceTypeService', 
	function($window, $routeParams, $scope, stopPlaceService, stopPlaceTypeService) {

		var stopPlaceId = $routeParams.stopPlaceId;

		$scope.stopPlaceTypes = stopPlaceTypeService.getStopPlaceTypes();

		stopPlaceService.getStopPlace(stopPlaceId).then(function(stopPlace) {
			$scope.stopPlace = stopPlace;

			var latitude = parseFloat($scope.stopPlace.centroid.location.latitude);
			var longitude = parseFloat($scope.stopPlace.centroid.location.longitude);


			$scope.center.lat = latitude;
			$scope.center.lng = longitude;
			$scope.markers.mainMarker.lat = latitude
			$scope.markers.mainMarker.lng = longitude;
			$scope.markers.mainMarker.message = $scope.stopPlace.name;
			
			console.log($scope.center);
			console.log($scope.markers.mainMarker);

			$scope.master = angular.copy($scope.stopPlace);

		});

		angular.extend($scope, {
			center: {
	            lat: 59.91,
	            lng: 10.75,
	            zoom: 12
	        },
	        markers: {
	            mainMarker: {
	                lat: 59.91,
	                lng: 10.75,
	                message: "No yet fetched",
	                focus: true,
	                draggable: false
	            }
	        },
            scrollWheelZoom: false

		});
		$scope.update = function(stopPlace) {
        	$scope.master = angular.copy(stopPlace);
        	stopPlaceService.saveStopPlace($scope.stopPlace).then(function() {
        		console.log("saved");
				$window.location.href = '#/';
        	});
      	};

      	$scope.reset = function() {
       		$scope.stopPlace = angular.copy($scope.master);
	    };

	}
]);