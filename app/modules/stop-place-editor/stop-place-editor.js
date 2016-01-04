'use strict';

angular.module('abzu.stopPlaceEditor', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/stopPlaceEditor/:stopPlaceId', {
    templateUrl: 'modules/stop-place-editor/stop-place-editor.html',
    controller: 'StopPlaceEditorCtrl'
  });
}])

.controller('StopPlaceEditorCtrl', ['$window', '$routeParams', '$scope', 'stopPlaceService', 'stopPlaceTypeService', 'leafletData', 'appConfig',
  function($window, $routeParams, $scope, stopPlaceService, stopPlaceTypeService, leafletData, config) {

    var stopPlaceMarkerIcon = {
      type: 'extraMarker',
      icon: 'ion-gear-a',
      markerColor: 'red',
      prefix: 'ion',
      shape: 'circle'
    };

    var quayMarkerIcon = {
      type: 'extraMarker',
      icon: 'ion-android-bus',
      markerColor: 'grey',
      shape: 'square',
      prefix: 'ion',
    };

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
        autodiscover: true,
        zoom: 6
      },
      layers: {
        baselayers: {
          osm: $scope.definedLayers.osm,
          local_map: $scope.definedLayers.local_map
        }
      },
      markers: {}
    });

    $scope.currentQuay = {};

    $scope.toggleLayer = function(layerName) {
      var baselayers = $scope.layers.baselayers;
      if (baselayers.hasOwnProperty(layerName)) {
        delete baselayers[layerName];
      } else {
        baselayers[layerName] = $scope.definedLayers[layerName];
      }
    };

    $scope.update = function() {
      delete $scope.stopPlace.markerKey;

      for (var q in $scope.stopPlace.quays) {
        delete $scope.stopPlace.quays[q].markerKey;
      }

      stopPlaceService.saveStopPlace($scope.stopPlace).then(function() {
        console.log("saved");
        $window.location.href = '#/';
      });
    };

    $scope.reset = function() {
      $scope.stopPlace = angular.copy($scope.master);
    };

    $scope.newQuay = function() {

      // For new quays, we cannot use the quay ID for marker key generation.
      var markerKey = new Date().getTime();
      var longitude = $scope.stopPlace.centroid.location.longitude;
      var latitude = $scope.stopPlace.centroid.location.latitude;

      $scope.stopPlace.quays.push({
        markerKey: markerKey,
        centroid: {
          location: {
            latitude: latitude,
            longitude: longitude
          }
        }
      });

      $scope.markers.newQuayMarker = {
        lat: latitude,
        lng: longitude,
        message: "Nytt stoppunkt",
        icon: quayMarkerIcon,
        focus: true,
        draggable: true,
        markerKey: markerKey
      };
    };

    $scope.removeQuay = function(quay) {
      $scope.stopPlace.quays.splice($scope.stopPlace.quays.indexOf(quay), 1);
    }

    $scope.isEditingQuay = function(quay) {
      if (!$scope.currentQuay.markerKey) return false;
      return $scope.currentQuay.markerKey == quay.markerKey;
    };

    $scope.quayFormClicked = function(quay) {
      console.log("Quay form clicked for quay with marker key " + quay.markerKey);
      if (quay.markerKey && $scope.markers[quay.markerKey]) {
        $scope.markers[quay.markerKey].focus = true;
        $scope.currentQuay = quay;
        $scope.currentObject = quay;
      }
    };

    var createBoundsArray = function(centroid) {
      return [centroid.location.latitude, centroid.location.longitude];
    };

    var createQuayMarkers = function(quays, bounds) {
      for (var i in quays) {
        var quay = quays[i];

        //Set a key on both quay and marker to be able to link those two later.
        var markerKey = createMarkerKey(quay.id);
        quay.markerKey = markerKey;

        if (!quay.centroid || !quay.centroid.location) {
          console.log("Quay does not have centroid or location. Ignoring " + quay.id + ": " + quay.name);
          continue;
        }

        $scope.markers[markerKey] = {
          lat: quay.centroid.location.latitude,
          lng: quay.centroid.location.longitude,
          message: "Stoppunkt: " + quay.name,
          icon: quayMarkerIcon,
          focus: false,
          draggable: true,
          markerKey: markerKey
        };

        bounds.push(createBoundsArray(quay.centroid));
      }
    };

    var populateStopPlace = function(stopPlace) {
      console.log("Populate stop place");
      $scope.stopPlace = stopPlace;
      $scope.master = angular.copy($scope.stopPlace);
      $scope.currentObject = $scope.stopPlace;

      var bounds = [];
      bounds.push(createBoundsArray($scope.stopPlace.centroid));

      var markerKey = createMarkerKey($scope.stopPlace.id);

      $scope.markers[markerKey] = {
        message: $scope.stopPlace.name,
        focus: true,
        draggable: true,
        icon: stopPlaceMarkerIcon,
        lat: $scope.stopPlace.centroid.location.latitude,
        lng: $scope.stopPlace.centroid.location.longitude,
        markerKey: markerKey
      };

      $scope.stopPlace.markerKey = markerKey;

      if (stopPlace.quays) {
        createQuayMarkers(stopPlace.quays, bounds);
      }

      $scope.$on("leafletDirectiveMarker.dragend", function(event, args) {
        console.log("marker dragged for object with markerKey " + args.model.markerKey);

        switchingCurrentEditingObjectFromLeafletEvent(args);
        $scope.currentObject.centroid.location.latitude = args.model.lat.toString();
        $scope.currentObject.centroid.location.longitude = args.model.lng.toString();
      });

      $scope.$on("leafletDirectiveMarker.popupopen", function(event, args) {
        switchingCurrentEditingObjectFromLeafletEvent(args);
      });

      leafletData.getMap().then(function(map) {
        if (bounds.length > 0) {
          map.fitBounds(bounds);
        }
        map.on('moveend', function() {
          stopPlaceService.getStopPlacesWithin(createBoundingBox(map)).then(populateNearbyMarkers);
        });
        stopPlaceService.getStopPlacesWithin(createBoundingBox(map)).then(populateNearbyMarkers);
      });
    };

    var switchingCurrentEditingObjectFromLeafletEvent = function(args) {
      console.log("Event for marker with key: " + args.model.markerKey);

      console.log($scope.stopPlace.markerKey);

      if (args.model.markerKey && args.model.markerKey === $scope.stopPlace.markerKey) {
        console.log("We are currently editing a stop place");

        $scope.currentQuay = {};
        $scope.currentObject = $scope.stopPlace;
      } else if (args.model.markerKey) {
        console.log("We are currently not editing a stop place, but a quay. " + args.model.markerKey);

        for (var q in $scope.stopPlace.quays) {
          var quay = $scope.stopPlace.quays[q];

          if (quay.markerKey == args.model.markerKey) {
            $scope.currentObject = quay;
            $scope.currentQuay = quay;
            //$scope.markers[createMarkerKey($scope.stopPlace.id)].focus = false;

            break;
          }
        }
      }

      removeFocusOnAllMarkers(args.model.markerKey);
    }

    var removeFocusOnAllMarkers = function(ignoreKey) {
      for (var m in $scope.markers) {
        if ($scope.markers[m].markerKey != ignoreKey && $scope.markers[m].group == "nearby") {
          $scope.markers[m].focus = false;
        }
      }
    };

    var createBoundingBox = function(map) {
      var bounds = map.getBounds();

      var boundingBox = {
        xMin: bounds.getSouthWest().lng,
        yMin: bounds.getSouthWest().lat,
        xMax: bounds.getNorthEast().lng,
        yMax: bounds.getNorthEast().lat
      };
      return boundingBox;
    };

    var createMarkerKey = function(id) {
      return id.replace(/[-]+/g, '_');
    };

    var populateNearbyMarkers = function(stopPlacesWithinBoundingBox) {
      console.log("Got " + stopPlacesWithinBoundingBox.length + " stop places from current bounding box");

      for (var i in stopPlacesWithinBoundingBox) {
        var relatedStopPlace = stopPlacesWithinBoundingBox[i];

        if (relatedStopPlace.id == $scope.stopPlace.id) {
          //console.log("Ignoring stop place with id " + $scope.stopPlace.id);
          continue;
        }

        var key = createMarkerKey(relatedStopPlace.id);

        $scope.markers[key] = {
          lat: relatedStopPlace.centroid.location.latitude,
          lng: relatedStopPlace.centroid.location.longitude,
          message: "<a href='#/stopPlaceEditor/" + relatedStopPlace.id + "'>" + relatedStopPlace.name + "</a>",
          draggable: false,
          clickable: true,
          riseOnHover: true,
          group: "nearby"
        };
      }
    };

    var stopPlaceId = $routeParams.stopPlaceId;
    stopPlaceService.getStopPlace(stopPlaceId).then(populateStopPlace);

    $scope.stopPlaceTypes = stopPlaceTypeService.getStopPlaceTypes();
  }
]);
