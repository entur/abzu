'use strict';

describe('abzu.StopPlaceList module', function() {

  beforeEach(function() {
  	module('abzu.StopPlaceList');
  	module('abzu.service');
  });

  describe('StopPlaceList controller', function() {
  	var $scope = {};
    it('should be defined', inject(function($controller) {
      var stopPlaceListCtrl = $controller('StopPlaceListCtrl', { $scope: $scope });
      expect(stopPlaceListCtrl).toBeDefined();
    }));
   /* 
    it('calls the stop place service if query changed', inject(function($controller) {
      var $scope = {};

      var stopPlaceService = {
        findStopPlacesByName: function() { return { then: function(query) { return {}}}},
        getStopPlaces: function() { return { then: function() {}}}
      };

      spyOn(stopPlaceService, "findStopPlacesByName");

      var controller = $controller('StopPlaceListCtrl', { $scope: $scope, stopPlaceService: stopPlaceService });
      $scope.name = "Slependen";
      $scope.change();
      expect(stopPlaceService.findStopPlacesByName).toHaveBeenCalled();
    })); */
  });

});