'use strict';

angular.module("abzu.service", []);

// Declare app level module which depends on views, and components
angular.module('abzu', [
  'ngRoute',
  'abzu.stopPlaceEditor',
  'abzu.stopPlaceList',
  'abzu.service',
  'abzu.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/stopPlaceList'});
}]);
