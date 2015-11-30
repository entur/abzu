'use strict';

angular.module('abzu.StopPlaceListView', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/StopPlaceListView', {
    templateUrl: 'modules/stop_place_list_view/stop_place_list_view.html',
    controller: 'StopPlaceListViewCtrl'
  });
}])

.controller('StopPlaceListViewCtrl', ['$scope', 'stopPlaceService', function($scope, stopPlaceService) {
    stopPlaceService.getStopPlaces().then(
    	function(stopPlaces) {
    		$scope.stopPlaces = stopPlaces
    	});
}]);