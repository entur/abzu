'use strict';

// Declare app level module which depends on views, and components
angular.module('abzu', [
  'ngRoute',
  'abzu.view1',
  'abzu.StopPlaceListView',
  'abzu.service',
  'abzu.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/StopPlaceListView'});
}]);
