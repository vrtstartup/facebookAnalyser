/* globals saveAs, moment */
'use strict';

/**
 * @ngdoc function
 * @name fbPageScraperApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the fbPageScraperApp
 */




// https://developers.facebook.com/docs/graph-api/reference/v2.7/post/



angular.module('fbPageScraperApp')
    .controller('MainCtrl', ['$scope', 'fbAPI', function($scope, fbAPI) {

        $scope.availablePages = [{
            name: 'vtm',
            id: 223630074319030,
            items: []
        }, {
            name: 'deredactie',
            id: 270994524621,
            items: []
        }, {
            name: 'nieuwsblad',
            id: 37823307325,
            items: []
        }, {
            name: 'hln',
            id: 45502366281,
            items: []
        }, {
            name: 'standaard',
            id: 7133374462,
            items: []
        }, {
            name: 'demorgen',
            id: 231742536958,
            items: []
        }];


        $scope.pagesToScrape = [];
        $scope.showExportButton = false;


        $scope.exportData = function() {

            var blob = new Blob([document.getElementById('exportable').innerHTML], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
            });
            saveAs(blob, 'FacebookAnalyse-' + moment($scope.minDate).format('YYYY-MM-DD') + '-' + moment($scope.maxDate).format('YYYY-MM-DD') + '.xls');
        };


        $scope.items = [];
        $scope.itemsToTable = [];
        $scope.headers = ['created_time', 'description', 'type', 'link', 'permalink_url', 'caption', 'name', 'picture', 'id', 'likes', 'reactions', 'comments', 'shares'];
        $scope.prom = [];
        $scope.brandsDone = 0;




        $scope.getItems = function(call, key) {
            fbAPI.getItems(call).then(function(response) {


                console.log(response);
                for (var i = 0; i < response.data.length; i++) {
                    $scope.pagesToScrape[key].items.push(response.data[i]);
                }
                if (response.paging && response.paging.next) {
                    $scope.getItems(response.paging.next, key);
                } else {

                    $scope.brandsDone++;
                }
            });

        };


        var setCounts = function(items) {

            var itemsProcessed = 0;
            items.forEach(function(item, index, array) {

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
                if (item.reactions && item.reactions.summary.total_count) {
                    item.reactions = item.reactions.summary.total_count;
                } else {
                    item.reactions = 0;
                }
                if (item.shares && item.shares.count) {
                    item.shares = item.shares.count;
                } else {
                    item.shares = 0;
                }
                itemsProcessed++;
                if (itemsProcessed === array.length) {
                    $scope.items = items;
                    $scope.addingUp = true;
                    $scope.showExportButton = true;
                }
            });
        };

        $scope.$watch(
            'brandsDone',
            function handleFooChange(newValue) {

                $scope.numberOfBrands = $scope.pagesToScrape.length;
                if (newValue === $scope.numberOfBrands) {
                    angular.forEach($scope.pagesToScrape, function(value) {

                        $scope.items = $scope.items.concat(value.items);
                    });
                    setCounts($scope.items);

                }

            }

        );


        $scope.getCall = function(minDate, maxDate) {
            $scope.showExportButton = false;
            // var itemsProcessed = 0;



            minDate = moment(minDate).format('YYYY-MM-DD');
            maxDate = moment(maxDate).format('YYYY-MM-DD');


            angular.forEach($scope.pagesToScrape, function(value, key) {

                var call = 'https://graph.facebook.com/v2.7/' + value.id + '/posts?fields=name,created_time,type,permalink_url,message,link,likes.summary%28true%29,reactions.summary%28true%29,shares,comments.summary%28true%29,object_id,description,picture,caption&since=' + minDate + '&until=' + maxDate;

                $scope.getItems(call, key);

                // itemsProcessed++;
                // if (itemsProcessed === array.length) {
                //     setCounts($scope.items);
                // }
            });

        };

    }]);