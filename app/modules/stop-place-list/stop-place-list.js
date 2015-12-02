'use strict';

angular.module('abzu.stopPlaceList', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/stopPlaceList', {
    templateUrl: 'modules/stop-place-list/stop-place-list.html',
    controller: 'StopPlaceListCtrl'
  });
}])

.controller('StopPlaceListCtrl', ['$scope', 'stopPlaceService', 'stopPlaceTypeService',
    function($scope, stopPlaceService, stopPlaceTypeService) {

    var setStopPlaceTypes = function() {
        for(var i in $scope.stopPlaces) {
                console.log("Populating stop place type for "+$scope.stopPlaces[i].name);
                $scope.stopPlaces[i].stopPlaceTypeName = stopPlaceTypeService
                    .getStopPlaceTypeNameFromValue($scope.stopPlaces[i].stopPlaceType);
            }
    };

    stopPlaceService.getStopPlaces().then(
    	function(stopPlaces) {
    		$scope.stopPlaces = stopPlaces;
            setStopPlaceTypes();
        });

    $scope.search = { query: "" };

    $scope.change = function(){
    	stopPlaceService.findStopPlacesByName($scope.search.query).then(
    		function(stopPlaces) {
    			$scope.stopPlaces = stopPlaces;
                setStopPlaceTypes();
    	});
  	};
}]);