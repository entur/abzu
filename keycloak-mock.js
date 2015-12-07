'use strict';

(function( window, undefined ) {
	//Mock Keycloak
    var Keycloak = function (config) {
    	console.log("config");
    	 this.init = function (initOptions) {
    	 	console.log("init");
    	 	return {
    	 		success : function(successFunction) {
        	    	successFunction;
        	    	return {
        	    		error: function() {}
        	    	}
        		}
          	}
        }
    }
    window.Keycloak = Keycloak;
})( window );