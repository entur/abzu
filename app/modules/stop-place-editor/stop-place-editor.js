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

		// Before stop place is loaded
		angular.extend($scope, {
            center: {
                lat: 0,
                lng: 0,
                zoom: 2
            }
        });


		stopPlaceService.getStopPlace(stopPlaceId).then(function(stopPlace) {
			$scope.stopPlace = stopPlace;
			$scope.master = angular.copy($scope.stopPlace);

			var latitude = parseFloat($scope.stopPlace.centroid.location.latitude);
			var longitude = parseFloat($scope.stopPlace.centroid.location.longitude);

			$scope.center = {
				lat: latitude,
				lng: longitude,
				zoom: 15
			};

			$scope.markers = {
				mainMarker: {
					lat: latitude,
					lng: longitude,
					message: $scope.stopPlace.name,
					focus: true,
		            draggable: true
				}
			};

            $scope.$on("leafletDirectiveMarker.dragend", function(event, args){
                $scope.stopPlace.centroid.location.latitude = args.model.lat.toString();
                $scope.stopPlace.centroid.location.longitude = args.model.lng.toString();
            });
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