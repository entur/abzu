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

  });
});