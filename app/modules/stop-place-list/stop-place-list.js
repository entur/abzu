'use strict';

angular.module('abzu.stopPlaceList', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/stopPlaceList', {
    templateUrl: 'modules/stop-place-list/stop-place-list.html',
    controller: 'StopPlaceListCtrl'
  });
}])

.controller('StopPlaceListCtrl', ['$scope', 'stopPlaceService', function($scope, stopPlaceService) {

    stopPlaceService.getStopPlaces().then(
    	function(stopPlaces) {
    		$scope.stopPlaces = stopPlaces;
    	});

    $scope.search = { query: "" };

    $scope.change = function(){
    	stopPlaceService.findStopPlacesByName($scope.search.query).then(
    		function(stopPlaces) {
    			$scope.stopPlaces = stopPlaces;
    	});
  	};
}]);