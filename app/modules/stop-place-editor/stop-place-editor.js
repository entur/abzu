'use strict';

angular.module('abzu.stopPlaceEditor', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/stopPlaceEditor/:stopPlaceId', {
    templateUrl: 'modules/stop-place-editor/stop-place-editor.html',
    controller: 'StopPlaceEditorCtrl'
  });
}])

.controller('StopPlaceEditorCtrl', ['$window', '$routeParams', '$scope', 'stopPlaceService', 'stopPlaceTypeService', 'leafletData', 'appConfig', 'quayTypeService',
  function($window, $routeParams, $scope, stopPlaceService, stopPlaceTypeService, leafletData, config, quayTypeService) {

    var stopPlaceMarkerIcon = {
      type: 'extraMarker',
      icon: 'ion-gear-a',
      markerColor: 'black',
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

    angular.extend($scope, {
      center: {
        autodiscover: true,
        zoom: 6
      },
      layers: {
        baselayers: config.leaflet.layers
      },
      markers: {}
    });

    $scope.currentQuay = {};

    $scope.toggleLayer = function(layerName) {
      var baselayers = $scope.layers.baselayers;
      if (baselayers.hasOwnProperty(layerName)) {
        delete baselayers[layerName];
      } else {
        baselayers[layerName] = $scope.layers.baselayers[layerName];
      }
    };

    $scope.save = function() {
      delete $scope.stopPlace.markerKey;

      for (var q in $scope.stopPlace.quays) {
        delete $scope.stopPlace.quays[q].markerKey;
      }

      stopPlaceService.saveStopPlace($scope.stopPlace).then(function() {
        console.log("saved");
        notification.notify("success", "Stop place was saved successfully");
        //$window.location.href = '#/';
      });
    };

    $scope.reset = function() {
      var stopPlace = angular.copy($scope.master);
      populateStopPlace(stopPlace);
    };

    $scope.newQuay = function() {

      // For new quays, we cannot use the quay ID for marker key generation.
      var markerKey = new Date().getTime();
      var longitude = $scope.stopPlace.centroid.location.longitude-0.0001;
      var latitude = $scope.stopPlace.centroid.location.latitude-0.0001;

      var quay = {
        markerKey: markerKey,
        name: "Ny Quay",
        centroid: {
          location: {
            latitude: latitude,
            longitude: longitude
          }
        }
      };

      $scope.stopPlace.quays.push(quay);

      $scope.markers[markerKey] = {
        lat: latitude,
        lng: longitude,
        message: quay.name,
        icon: quayMarkerIcon,
        focus: true,
        draggable: true,
        markerKey: markerKey
      };
    };

    $scope.removeQuay = function(quay, $event) {
      $event.stopPropagation();
      delete $scope.markers[quay.markerKey];
      $scope.stopPlace.quays.splice($scope.stopPlace.quays.indexOf(quay), 1);
    };

    $scope.quayNameChanged = function(quay) {
      $scope.markers[quay.markerKey].message = "Quay: " + quay.name;
    };

    $scope.stopPlaceNameChanged = function() {
      $scope.markers[$scope.stopPlace.markerKey].message = $scope.stopPlace.name;
    };

    $scope.isEditingQuay = function(quay) {
      if (!$scope.currentQuay) return false;
      return $scope.currentQuay.markerKey === quay.markerKey;
    };

    $scope.isEditingStopPlace = function() {
      return $scope.stopPlace === $scope.currentObject;
    };

    $scope.stopPlaceClicked = function() {
      $scope.currentObject = $scope.stopPlace;
      $scope.currentQuay = null;
      removeFocusOnAllMarkersExceptNearby();
      $scope.markers[$scope.stopPlace.markerKey].focus = true;
    };

    $scope.quayFormClicked = function(quay) {
      console.log("Quay form clicked for quay with marker key " + quay.markerKey);
      console.log($scope.markers[quay.markerKey]);

      if (quay.markerKey && $scope.markers[quay.markerKey]) {
        removeFocusOnAllMarkersExceptNearby();

        console.log("Setting focus for marker");
        $scope.markers[quay.markerKey].focus = true;
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
          message: "Quay: " + quay.name,
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
        $scope.currentObject.centroid.location.latitude = args.model.lat;
        $scope.currentObject.centroid.location.longitude = args.model.lng;

        $scope.markers[args.model.markerKey].lat = args.model.lat;
        $scope.markers[args.model.markerKey].lng = args.model.lng;
      });

      $scope.$on("leafletDirectiveMarker.popupopen", function(event, args) {
        switchingCurrentEditingObjectFromLeafletEvent(args);
      });

      leafletData.getMap().then(function(map) {
        if (bounds.length > 0) {
          map.fitBounds(bounds);
        }
        var stopPlaceSearch = {
          boundingBox : createBoundingBox(map),
          ignoreStopPlaceId: stopPlace.id
        }
        map.on('moveend', function() {
          stopPlaceService.getStopPlacesWithin(stopPlaceSearch).then(populateNearbyMarkers);
        });
        stopPlaceService.getStopPlacesWithin(stopPlaceSearch).then(populateNearbyMarkers);
      });
    };

    var switchingCurrentEditingObjectFromLeafletEvent = function(args) {
      console.log("Event for marker with key: " + args.model.markerKey);

      if (args.model.markerKey && args.model.markerKey === $scope.stopPlace.markerKey) {
        console.log("We are currently editing a stop place");

        $scope.currentQuay = {};
        $scope.currentObject = $scope.stopPlace;
      } else if (args.model.markerKey) {
        console.log("We are currently editing a quay with marker key: " + args.model.markerKey);

        for (var q in $scope.stopPlace.quays) {
          var quay = $scope.stopPlace.quays[q];

          if (quay.markerKey === args.model.markerKey) {
            $scope.currentObject = quay;
            $scope.currentQuay = quay;
            break;
          }
        }
      }
    };

    var removeFocusOnAllMarkersExceptNearby = function() {
      for (var m in $scope.markers) {
        if ($scope.markers[m].group !== "nearby") {
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
    $scope.quayTypes = quayTypeService.getQuayTypes();

  }
]);
