/*  TODO

- Datetime naar twee velden, date en time
- add "message" als veld per post
- admin_creator toevoegen en omzetten naar de fb pages
-

*/



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

        // https://graph.facebook.com/v2.6/223630074319030/posts/?fields=created_time,type,permalink_url,message,link,likes,shares,comments,object_id,description,picture,caption&since=2016-07-04&until=2016-07-10&access_token=627346177420647|-iiwTODKuuPfm0KBeAJd9sD1MY0
        // Public API here

        var totalItems = [];
        var setCounts = function(items) {

            var itemsProcessed = 0;
            items.forEach((item, index, array) => {
                if (item.comments && item.comments.summary.total_count) {
                    item.comments = item.comments.summary.total_count;
                } else {
                    item.comments = 0;
                }
                if (item.likes && item.likes.summary.total_count) {
                    item.likes = item.likes.summary.total_count;
                } else {
                    item.likes = 0;
                }
                if (item.shares && item.shares.count) {
                    item.shares = item.shares.count;
                } else {
                    item.shares = 0;
                }
                itemsProcessed++;
                if (itemsProcessed === array.length) {
                    $scope.itemsToTable = items;
                    $scope.$apply();

                }
            });
        };

        var nextItems = function(call, brand) {
            var deferred = $q.defer();
            FB.api(call, function(response) {
                for (var i = 0; i < response.data.length; i++) {
                    brand.items.push(response.data[i]);
                }
                if (response.paging && response.paging.next) {
                    nextItems(response.paging.next, brand);
                } else {
                    deferred.resolve(brand);
                }
            });
            return deferred.promise;
        };

        // var getWeek = function(brand) {
        //     var deferred = $q.defer();
        //     FB.api('/' + brand + '/posts/', {
        //         fields: 'created_time,type,permalink_url,message,link,likes.summary(true),shares,comments.summary(true),object_id,description,picture,caption',
        //         since: '2016-07-04',
        //         until: '2016-07-10',
        //     }, function(response) {
        //         if (!response || response.error) {
        //             deferred.reject('Error occured');
        //         } else {
        //             deferred.resolve(response);
        //             console.log(response);

        //         }
        //     });
        //     return deferred.promise;
        // };

        return {
            getItems: function(call) {
                var deferred = $q.defer();
                // var call = 'https://graph.facebook.com/v2.7/' + brand.id + '/posts?fields=created_time,type,permalink_url,message,link,likes.summary%28true%29,shares,comments.summary%28true%29,object_id,description,picture,caption&since=2016-07-04&until=2016-07-10';
                FB.api(call, function(response) {
                    deferred.resolve(response);

                });

                // .then(function(response) {
                //     console.log(response);

                // brand.items.push[response.data];
                // if (response.paging.next) {
                //     nextItems(response.paging.next, brand).then(function(response) {
                //         console.log('yes');
                //         console.log(response);

                //         deferred.resolve(brand);



                //     });
                // } else {
                //     deferred.resolve(items);

                // }
                // });
                return deferred.promise;
            },

        };
    }]);
