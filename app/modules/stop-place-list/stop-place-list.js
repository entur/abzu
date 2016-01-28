'use strict';

angular.module('abzu.stopPlaceList', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/stopPlaceList', {
    templateUrl: 'modules/stop-place-list/stop-place-list.html',
    controller: 'StopPlaceListCtrl'
  });
}])

.controller('StopPlaceListCtrl', ['$scope', 'stopPlaceService', 'stopPlaceTypeService', 'leafletData', 'appConfig', '$location',
    function($scope, stopPlaceService, stopPlaceTypeService, leafletData, config, $location) {

    $scope.search = { query: "" };
    $scope.markers = {};

    $scope.definedLayers = {
        local_map: config.leaflet.tesseraLayer,
        osm: {
            name: 'OpenStreetMap',
            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            type: 'xyz'
        }
    };

    angular.extend($scope, {
        center: {
          autodiscover: true
        },
        events: {
            map: {
                enable: [],
                logic: 'emit'
            }
        },
        layers: {
            baselayers: {
              local_map: $scope.definedLayers.local_map,
              osm: $scope.definedLayers.osm
            }
        }
    });

    stopPlaceService.getStopPlaces().then(
        function(stopPlaces) {
            $scope.stopPlaces = stopPlaces;
            updateScope();
    });

    $scope.toggleLayer = function(layerName) {
        var baselayers = $scope.layers.baselayers;
        if (baselayers.hasOwnProperty(layerName)) {
            delete baselayers[layerName];
        } else {
            baselayers[layerName] = $scope.definedLayers[layerName];
        }
    };

    $scope.edit = function(stopPlaceId) {
        $location.path("/stopPlaceEditor/"+stopPlaceId);
    };

    var updateScope = function() {
        $scope.markers = {};
        var bounds = [];

        // Use time in millis in cluster group to avoid problem with missing markers/clusters.
        var timeInMillis = new Date().getTime();

        for(var i in $scope.stopPlaces) {
            var stopPlace = $scope.stopPlaces[i];
            stopPlace.stopPlaceTypeName = stopPlaceTypeService
                .getStopPlaceTypeNameFromValue(stopPlace.stopPlaceType);

            var latitude = parseFloat(stopPlace.centroid.location.latitude);
            var longitude = parseFloat(stopPlace.centroid.location.longitude);

            var key = stopPlace.name.replace(/[^a-zA-Z]+/g, '')+i;
            $scope.markers[key] = {
                group: "stops"+timeInMillis,
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
            if(bounds.length > 0) {
                map.fitBounds(bounds);
            }
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
