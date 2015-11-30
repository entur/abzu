'use strict';

// Declare app level module which depends on views, and components
angular.module('abzu', [
  'ngRoute',
  'abzu.view1',
  'abzu.StopPlaceList',
  'abzu.service',
  'abzu.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/StopPlaceList'});
}]);
