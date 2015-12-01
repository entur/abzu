'use strict';

angular.module('abzu.stopPlaceEditor', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/stopPlaceEditor/:stopPlaceId', {
    templateUrl: 'modules/stop-place-editor/stop-place-editor.html',
    controller: 'StopPlaceEditorCtrl'
  });
}])

.controller('StopPlaceEditorCtrl', ['$window', '$routeParams', '$scope', 'stopPlaceService', 
	function($window, $routeParams, $scope, stopPlaceService) {

		var stopPlaceId = $routeParams.stopPlaceId;

		stopPlaceService.getStopPlace(stopPlaceId).then(function(stopPlace) {
			$scope.stopPlace = stopPlace;
			console.log($scope.stopPlace);
			$scope.master = angular.copy($scope.stopPlace);
		});

		$scope.update = function(stopPlace) {
        	$scope.master = angular.copy(stopPlace);
        	stopPlaceService.saveStopPlace($scope.stopPlace).then(function() {
        		console.log("saved");
				$window.location.href = '#/';
        	});
      	};

      	$scope.reset = function() {
       		$scope.stopPlace = angular.copy($scope.master);
	    };

	}
]);