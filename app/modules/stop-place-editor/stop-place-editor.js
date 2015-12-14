'use strict';

angular.module('abzu.stopPlaceEditor', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/stopPlaceEditor/:stopPlaceId', {
    templateUrl: 'modules/stop-place-editor/stop-place-editor.html',
    controller: 'StopPlaceEditorCtrl'
  });
}])

.controller('StopPlaceEditorCtrl', ['$window', '$routeParams', '$scope', 'stopPlaceService', 'stopPlaceTypeService', 'leafletData',
	function($window, $routeParams, $scope, stopPlaceService, stopPlaceTypeService, leafletData) {

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

	    var populateStopPlace = function(stopPlace) {
			$scope.stopPlace = stopPlace;
			$scope.master = angular.copy($scope.stopPlace);

			var latitude = $scope.stopPlace.centroid.location.latitude;
			var longitude = $scope.stopPlace.centroid.location.longitude;

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

			$scope.originalMarker = angular.copy($scope.markers);

            $scope.$on("leafletDirectiveMarker.dragend", function(event, args){
                $scope.stopPlace.centroid.location.latitude = args.model.lat.toString();
                $scope.stopPlace.centroid.location.longitude = args.model.lng.toString();
            });

            leafletData.getMap().then(function(map) {
	            map.on('moveend', function() { 

					var bounds = map.getBounds();

					var boundingBox = {
						xMin: bounds.getSouthWest().lng,
						yMin: bounds.getSouthWest().lat,
						xMax: bounds.getNorthEast().lng,
						yMax: bounds.getNorthEast().lat
					};

					stopPlaceService.getStopPlacesWithin(boundingBox).then(populateNearbyMarkers);
				});
	        });
        };

	    var populateNearbyMarkers = function(stopPlacesWithinBoundingBox) {
			console.log("Got " + stopPlacesWithinBoundingBox.length +" nearby stop places");


			$scope.markers = angular.copy($scope.originalMarker);
	
			for(var i in stopPlacesWithinBoundingBox) {

				var relatedStopPlace = stopPlacesWithinBoundingBox[i];
				
				var key = relatedStopPlace.id.replace(/[-]+/g, '_');

				if(relatedStopPlace.id == $scope.stopPlace.id) {
					console.log("Ignoring stop place with id " + $scope.stopPlace.id);
					continue;
				}

	            $scope.markers[key] = {
	                group: "stops",
	                lat: relatedStopPlace.centroid.location.latitude,
	                lng: relatedStopPlace.centroid.location.longitude,
	                message: "<a href='#/stopPlaceEditor/"+relatedStopPlace.id+"'>"+relatedStopPlace.name+"</a>",
	                draggable: false,
	                clickable: true,
	                riseOnHover: true,
	                disableClusteringAtZoom: 2
	            };
			}

		};

		stopPlaceService.getStopPlace(stopPlaceId).then(populateStopPlace);
     
	}
]);