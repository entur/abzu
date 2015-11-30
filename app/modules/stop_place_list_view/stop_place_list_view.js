'use strict';

angular.module('abzu.StopPlaceListView', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/StopPlaceListView', {
    templateUrl: 'modules/stop_place_list_view/stop_place_list_view.html',
    controller: 'StopPlaceListViewCtrl'
  });
}])

.controller('StopPlaceListViewCtrl', ['$scope', '$http', function($scope, $http) {

	// add error handling, do this in a service or factory for reuse. Configure it.
    $http.get('http://localhost:1871/jersey/stop_place').
        success(function(data) {
            $scope.stopPlaces = data;
        });
}]);