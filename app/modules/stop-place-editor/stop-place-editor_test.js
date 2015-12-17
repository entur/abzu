'use strict';

describe('abzu.stopPlaceEditor module', function() {

  beforeEach(function() {
  	angular.mock.module('abzu.stopPlaceEditor');
  	angular.mock.module('abzu.service');
  });

  describe('stopPlaceEditor controller', function(){


    it('should be defined', inject(function($controller) {
      var $scope = {};
      var $routeParams = {
      	stopPlaceId : 123
      };
      var StopPlaceEditorCtrl = $controller('StopPlaceEditorCtrl', {$scope: $scope, leafletData: {}, $routeParams: $routeParams});
      
      expect(StopPlaceEditorCtrl).toBeDefined();

    }));
  });
});