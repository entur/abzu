'use strict';

describe('abzu.StopPlaceListView module', function() {

  beforeEach(module('abzu.StopPlaceListView'));

  describe('StopPlaceListView controller', function() {
  	var $scope = {};
    it('should be defined', inject(function($controller) {
      var stopPlaceListViewCtrl = $controller('StopPlaceListViewCtrl', { $scope: $scope });
      expect(stopPlaceListViewCtrl).toBeDefined();
    }));

  });
});