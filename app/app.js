'use strict';


angular.module("abzu.service", []);

// Declare app level module which depends on views, and components
var module = angular.module('abzu', [
  'ngRoute',
  'ui-leaflet',
  'abzu.stopPlaceEditor',
  'abzu.stopPlaceList',
  'abzu.service',
  'abzu.version'
]);

module.config(['$routeProvider', function($routeProvider) {
	console.log("Setting up route provider");
 	$routeProvider.otherwise({redirectTo: '/stopPlaceList'});
}]);

console.log("Creating auth object");
var auth = {};
var logout = function(){
    console.log('*** LOGOUT');
    auth.loggedIn = false;
    auth.authz = null;
    window.location = auth.logoutUrl;
};

module.run(function ($http) {
	console.log("Setting up keycloak")
    var keycloakAuth = new Keycloak('keycloak.json');
    auth.loggedIn = false;

    keycloakAuth.init({ onLoad: 'login-required' }).success(function () {
        auth.loggedIn = true;
        auth.authz = keycloakAuth;
        auth.logoutUrl = keycloakAuth.authServerUrl + "/realms/demo/tokens/logout?redirect_uri=/angular-product/index.html";
        console.log("create factory Auth");
        module.factory('Auth', function() {
            return auth;
        });
    //    angular.bootstrap(document, ["product"]);


    }).error(function () {
    	console.log("Error from keycloakAuth.init");
        //If error in the app, this will cause endless redirect: window.location.reload();
    });
});

// Registering the authInterceptor must run after Auth is available.
module.run(function() {
	module.factory('authInterceptor', ["$q", "Auth", function($q, Auth) {
	    return {
	        'request': function (config) {
	            var deferred = $q.defer();
	            if (Auth.authz.token) {
	                Auth.authz.updateToken(5).success(function() {
	                    config.headers = config.headers || {};
	                    config.headers.Authorization = 'Bearer ' + Auth.authz.token;

	                    deferred.resolve(config);
	                }).error(function() {
	                        deferred.reject('Failed to refresh token');
	                });
	            }
	            return deferred.promise;
	        },
	        'requestError': function(response) {
	    		if (response.status == 401) {
	                console.log('session timeout?');
	                logout();
	            } else if (response.status == 403) {
	                alert("Forbidden");
	            } else if (response.status == 404) {
	                alert("Not found");
	            } else if (response.status) {
	                if (response.data && response.data.errorMessage) {
	                    alert(response.data.errorMessage);
	                } else {
	                    alert("An unexpected server error has occurred");
	                }
	            }
	            return $q.reject(response);
	        }
	    };
	}]);

	module.config(['$httpProvider', function($httpProvider) {
		console.log("Setting up httpProvider provider");
    	$httpProvider.interceptors.push('authInterceptor');
	}]);
});
