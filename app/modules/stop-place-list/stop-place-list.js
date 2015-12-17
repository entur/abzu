'use strict';

angular.module('abzu.stopPlaceList', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/stopPlaceList', {
    templateUrl: 'modules/stop-place-list/stop-place-list.html',
    controller: 'StopPlaceListCtrl'
  });
}])

.controller('StopPlaceListCtrl', ['$scope', 'stopPlaceService', 'stopPlaceTypeService', 'leafletData', 'appConfig',
    function($scope, stopPlaceService, stopPlaceTypeService, leafletData, config) {
    $scope.search = { query: "" };
console.log(config.leaflet);
    $scope.definedLayers = {
        local_map: config.leaflet.tesseraLayer/*{
            name: 'Tessera tiles',
            url: 'http://localhost:8088/hsl-map/{z}/{x}/{y}.png',
            type: 'xyz'
        }*/,
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
                osm: $scope.definedLayers.osm,
                local_map: $scope.definedLayers.local_map
            }
        }
    });

    $scope.toggleLayer = function(layerName) {
        var baselayers = $scope.layers.baselayers;
        if (baselayers.hasOwnProperty(layerName)) {
            delete baselayers[layerName];
        } else {
            baselayers[layerName] = $scope.definedLayers[layerName];
        }
    };

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
            $scope.markers = markers;
            if(Object.keys($scope.markers).length > 0) {
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