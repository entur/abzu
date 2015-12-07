'use strict';

angular.module('abzu.topBar', [])
	.controller('TopBarCtrl', ['$scope', 'Auth',
    	function($scope, Auth) {
    		$scope.logout = function() {
    			console.log("Logout button clicked");
    			Auth.logout();
    		};
    }]);