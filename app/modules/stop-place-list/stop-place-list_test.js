'use strict';

describe('abzu.stopPlaceList module', function() {

  beforeEach(function() {
  	angular.mock.module('abzu.stopPlaceList');
  	angular.mock.module('abzu.service');
    angular.mock.module(function ($provide) {
      $provide.value('appConfig', {tiamat: {baseUrl: "http://localhost"}});
    });
  });

  describe('StopPlaceList controller', function() {
  	var $scope = {};
    var leafletData = {};

    it('should be defined', inject(function($controller) {

      var stopPlaceListCtrl = $controller('StopPlaceListCtrl', { $scope: $scope, leafletData: leafletData });
      expect(stopPlaceListCtrl).toBeDefined();
    }));
   
    it('calls the stop place service to do a new search if query changed', inject(function($controller) {
      var $scope = {};

      var findStopPlacesByNameCalled = false;

      var stopPlaceService = {
        findStopPlacesByName : function (name) {
          console.log("findStopPlacesByName "+name);
          return {
            then : function(functionReference) {
              console.log("findStopPlacesByName.then");
              findStopPlacesByNameCalled = true;

            }
          }
        },
        getStopPlaces : function () {
         return {
            then : function(functionReference) {
              return {name: "name"}
            }
          }
        }
      };


      var controller = $controller('StopPlaceListCtrl', { $scope: $scope, stopPlaceService: stopPlaceService, leafletData: leafletData });
      $scope.search.query = "Slependen";
      $scope.change();
      expect(findStopPlacesByNameCalled).toBe(true);
    })); 
  });

});