'use strict';

angular.module('myApp.StopPlaceListView', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/StopPlaceListView', {
    templateUrl: 'stop_place_list_view/stop_place_list_view.html',
    controller: 'StopPlaceListViewCtrl'
  });
}])

.controller('StopPlaceListViewCtrl', ['$scope', function($scope) {

	$scope.stopPlaces = [{name: "Ikea Slependen", stopPlaceType: "bus"}, {name: "Sandvika", stopPlaceType: "train"}];


}]);