'use strict';

describe('abzu.stopPlaceEditor module', function() {

  beforeEach(function() {
  	module('abzu.stopPlaceEditor');
  	module('abzu.service');
  });

  describe('stopPlaceEditor controller', function(){


    it('should be defined', inject(function($controller) {
      var $scope = {};
      var $routeParams = {
      	stopPlaceId : 123
      };
      var StopPlaceEditorCtrl = $controller('StopPlaceEditorCtrl', {$scope: $scope, $routeParams: $routeParams});
      
      expect(StopPlaceEditorCtrl).toBeDefined();

    }));
  });
});