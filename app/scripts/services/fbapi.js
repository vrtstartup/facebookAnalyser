/* globals FB */
'use strict';

/**
 * @ngdoc service
 * @name fbPageScraperApp.fbAPI
 * @description
 * # fbAPI
 * Factory in the fbPageScraperApp.
 */
angular.module('fbPageScraperApp')
    .factory('fbAPI', ['$q', function($q) {

        return {
            getItems: function(call) {
                var deferred = $q.defer();
                FB.api(call, function(response) {
                    deferred.resolve(response);

                });

                return deferred.promise;
            },

        };
    }]);