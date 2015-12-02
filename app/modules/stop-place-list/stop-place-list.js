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

    stopPlaceService.getStopPlaces().then(
    	function(stopPlaces) {
    		$scope.stopPlaces = stopPlaces;

            for(var i in $scope.stopPlaces) {
                $scope.stopPlaces[i].stopPlaceTypeName = stopPlaceTypeService
                    .getStopPlaceTypeNameFromValue($scope.stopPlaces[i].stopPlaceType);
            }

        });

    $scope.search = { query: "" };

    $scope.change = function(){
    	stopPlaceService.findStopPlacesByName($scope.search.query).then(
    		function(stopPlaces) {
    			$scope.stopPlaces = stopPlaces;
    	});
  	};
}]);