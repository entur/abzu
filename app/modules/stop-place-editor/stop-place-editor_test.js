'use strict';

describe('abzu.stopPlaceEditor module', function() {

  var stopPlaceService;

  beforeEach(function() {
      angular.mock.module('abzu.service');
      angular.mock.module('abzu.stopPlaceEditor');

      stopPlaceService = {
        updateCalled: false,
        saveStopPlace : function (stopPlace) {
          console.log("updateStopPlace "+stopPlace);
          return {
            then : function(functionReference) {
              stopPlaceService.updateCalled = true;
              functionReference();
            }
          }
        },
        getStopPlace : function(stopPlaceId) {
          return {
            then : function(functionReference) {
              console.log("Get stop place");
            }
          }
        }
      };
   });

  describe('stopPlaceEditor controller', function(){
    it('should be defined', inject(function($controller) {
      var $scope = {};
      var $routeParams = {
      	stopPlaceId : 123
      };
      var StopPlaceEditorCtrl = $controller('StopPlaceEditorCtrl', {$scope: $scope, leafletData: {}, stopPlaceService: stopPlaceService, $routeParams: $routeParams, appConfig: {leaflet: {tesseraLayer: {}}}});
      
      expect(StopPlaceEditorCtrl).toBeDefined();

    }));
  });

  describe('update stop place', function() {
    it('should call save stop place in stop place service', inject(function($controller) {

      var stopPlace = { id: "123" };
      var $scope = { stopPlace: stopPlace };
      var StopPlaceEditorCtrl = $controller('StopPlaceEditorCtrl', {$scope: $scope, leafletData: {}, stopPlaceService: stopPlaceService, $routeParams: {stopPlaceId: stopPlace.id}, appConfig: {leaflet: {tesseraLayer: {}}}});

      $scope.update();

      expect(stopPlaceService.updateCalled).toBe(true);
    }));
  });
});