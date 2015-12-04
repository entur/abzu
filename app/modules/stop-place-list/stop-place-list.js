'use strict';

angular.module('abzu.stopPlaceList', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/stopPlaceList', {
    templateUrl: 'modules/stop-place-list/stop-place-list.html',
    controller: 'StopPlaceListCtrl'
  });
}])

.controller('StopPlaceListCtrl', ['$scope', 'stopPlaceService', 'stopPlaceTypeService', 'leafletData',
    function($scope, stopPlaceService, stopPlaceTypeService, leafletData) {

    $scope.search = { query: "" };

    angular.extend($scope, {
        center: {
          autodiscover: true
        },
        events: {
            map: {
                enable: [rr],
                logic: 'emit'
            }
        }
    });

    stopPlaceService.getStopPlaces().then(
    function(stopPlaces) {
        $scope.stopPlaces = stopPlaces;
        updateScope();
    });

    var updateScope = function() {
        $scope.markers = {};
        var bounds = [];
        var markers = {};
        for(var i in $scope.stopPlaces) {

            var stopPlace = $scope.stopPlaces[i];
            stopPlace.stopPlaceTypeName = stopPlaceTypeService
                .getStopPlaceTypeNameFromValue(stopPlace.stopPlaceType);

            var latitude = parseFloat(stopPlace.centroid.location.latitude);
            var longitude = parseFloat(stopPlace.centroid.location.longitude);

            var key = stopPlace.name.replace(/[^a-zA-Z]+/g, '')+i;
            markers[key] = {
                group: "stops",
                lat: latitude,
                lng: longitude,
                message: "<a href='#/stopPlaceEditor/"+stopPlace.id+"'>"+stopPlace.name+"</a>",
                draggable: false,
                clickable: true,
                riseOnHover: true
            };

            bounds.push([latitude, longitude]);
        }

        leafletData.getMap().then(function(map) {
            console.log("leafletData.getMap");
            $scope.markers = markers;
            console.log($scope.markers);
            map.fitBounds(bounds);
        });
    };

    $scope.change = function(){
    	stopPlaceService.findStopPlacesByName($scope.search.query).then(
    		function(stopPlaces) {
    			$scope.stopPlaces = stopPlaces;
                updateScope();
    	});
  	};
}]);