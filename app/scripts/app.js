'use strict';

/**
 * @ngdoc overview
 * @name fbPageScraperApp
 * @description
 * # fbPageScraperApp
 *
 * Main module of the application.
 */
angular
    .module('fbPageScraperApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ngMaterial',
        'ngCsv'
    ])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                controllerAs: 'main'
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .config(function($mdDateLocaleProvider) {




        // Example uses moment.js to parse and format dates.
        // $mdDateLocaleProvider.parseDate = function(dateString) {
        //   var m = moment(dateString, 'L', true);
        //   return m.isValid() ? m.toDate() : new Date(NaN);
        // };

        // $mdDateLocaleProvider.formatDate = function(date) {
        //     var m = moment(date);
        //     return moment(date).format('YYYY-MM-DD');
        //     //   return m.isValid() ? m.format('L') : '';
        // };

    })
    .run(['$rootScope', '$window', 'srvAuth',
        function($rootScope, $window, srvAuth) {

            $rootScope.user = {};

            $window.fbAsyncInit = function() {
                // Executed when the SDK is loaded

                FB.init({

                    appId: 917708861672488,

                    channelUrl: './views/channel.html',

                    /*
                     Set if you want to check the authentication status
                     at the start up of the app
                    */

                    status: true,

                    /*
                     Enable cookies to allow the server to access
                     the session
                    */

                    cookie: true,

                    /* Parse XFBML */

                    xfbml: true
                });

                srvAuth.watchLoginChange();

            };

            (function(d) {
                // load the Facebook javascript SDK

                var js,
                    id = 'facebook-jssdk',
                    ref = d.getElementsByTagName('script')[0];

                if (d.getElementById(id)) {
                    return;
                }

                js = d.createElement('script');
                js.id = id;
                js.async = true;
                js.src = "//connect.facebook.net/en_US/all.js";

                ref.parentNode.insertBefore(js, ref);

            }(document));

        }
    ]);