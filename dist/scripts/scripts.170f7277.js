"use strict";angular.module("fbPageScraperApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","ngMaterial","ngCsv"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"main"}).otherwise({redirectTo:"/"})}]).run(["$rootScope","$window","srvAuth",function(a,b,c){a.user={},b.fbAsyncInit=function(){FB.init({appId:917708861672488,channelUrl:"./views/channel.html",status:!0,cookie:!0,xfbml:!0}),c.watchLoginChange()},function(a){var b,c="facebook-jssdk",d=a.getElementsByTagName("script")[0];a.getElementById(c)||(b=a.createElement("script"),b.id=c,b.async=!0,b.src="//connect.facebook.net/en_US/all.js",d.parentNode.insertBefore(b,d))}(document)}]),angular.module("fbPageScraperApp").controller("MainCtrl",["$scope","fbAPI",function(a,b){a.availablePages=[{name:"vtm",id:0xcb63ef2410b6,items:[]},{name:"deredactie",id:270994524621,items:[]},{name:"nieuwsblad",id:37823307325,items:[]},{name:"hln",id:45502366281,items:[]},{name:"standaard",id:7133374462,items:[]}],a.pagesToScrape=[],a.showExportButton=!1,a.exportData=function(){var b=new Blob([document.getElementById("exportable").innerHTML],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"});saveAs(b,"FacebookAnalyse-"+moment(a.minDate).format("YYYY-MM-DD")+"-"+moment(a.maxDate).format("YYYY-MM-DD")+".xls")},a.items=[],a.itemsToTable=[],a.headers=["created_time","description","type","link","permalink_url","caption","name","picture","id","likes","reactions","comments","shares"],a.prom=[],a.brandsDone=0,a.getItems=function(c,d){b.getItems(c).then(function(b){console.log(b);for(var c=0;c<b.data.length;c++)a.pagesToScrape[d].items.push(b.data[c]);b.paging&&b.paging.next?a.getItems(b.paging.next,d):a.brandsDone++})};var c=function(b){var c=0;b.forEach(function(d,e,f){d.comments&&d.comments.summary.total_count?d.comments=d.comments.summary.total_count:d.comments=0,d.likes&&d.likes.summary.total_count?d.likes=d.likes.summary.total_count:d.likes=0,d.reactions&&d.reactions.summary.total_count?d.reactions=d.reactions.summary.total_count:d.reactions=0,d.shares&&d.shares.count?d.shares=d.shares.count:d.shares=0,c++,c===f.length&&(a.items=b,a.addingUp=!0,a.showExportButton=!0)})};a.$watch("brandsDone",function(b){a.numberOfBrands=a.pagesToScrape.length,b===a.numberOfBrands&&(angular.forEach(a.pagesToScrape,function(b){a.items=a.items.concat(b.items)}),c(a.items))}),a.getCall=function(b,c){a.showExportButton=!1,b=moment(b).format("YYYY-MM-DD"),c=moment(c).format("YYYY-MM-DD"),angular.forEach(a.pagesToScrape,function(d,e){var f="https://graph.facebook.com/v2.7/"+d.id+"/posts?fields=name,created_time,type,permalink_url,message,link,likes.summary%28true%29,reactions.summary%28true%29,shares,comments.summary%28true%29,object_id,description,picture,caption&since="+b+"&until="+c;a.getItems(f,e)})}}]),angular.module("fbPageScraperApp").service("srvAuth",["$rootScope",function(a){this.watchLoginChange=function(){var a=this;FB.Event.subscribe("auth.authResponseChange",function(b){"connected"===b.status&&a.getUserInfo()})},this.getUserInfo=function(){var b=this;FB.api("/me",function(c){a.$apply(function(){a.user=b.user=c})})},this.logout=function(){var b=this;FB.logout(function(){a.$apply(function(){a.user=b.user={}})})}}]),angular.module("fbPageScraperApp").factory("fbAPI",["$q",function(a){return{getItems:function(b){var c=a.defer();return FB.api(b,function(a){c.resolve(a)}),c.promise}}}]),angular.module("fbPageScraperApp").run(["$templateCache",function(a){a.put("views/channel.html",'<script src="http://connect.facebook.net/en_US/all.js"></script>'),a.put("views/main.html",'<div ng-controller="MainCtrl" layout="column" ng-cloak> <md-toolbar class="md-warn"> <div class="md-toolbar-tools"> <h2 class="md-flex">FB Page Scraper</h2> </div> </md-toolbar> <md-content flex layout-padding> <div layout-gt-md="row" layout="column" layout-sm="column"> <section layout-padding> <fb:login-button show-faces="true" max-rows="1" size="large"></fb:login-button> </section> <section layout-padding> <div layout="row" layout-align="start" flex> <md-input-container flex="30"> <label>Pages</label> <md-select ng-model="pagesToScrape" multiple> <md-select-header> <input ng-model="searchTerm" type="search" placeholder="Search for a page.." class="md-text"> </md-select-header> <md-optgroup label="pages"> <md-option ng-value="page" ng-repeat="page in availablePages |\n              filter:searchTerm">{{page.name}}</md-option> </md-optgroup> </md-select> </md-input-container> <div layout="row" layout-align="start center" class="grid-datepicker" layout-padding> <span>Begin Datum: </span> <md-datepicker ng-model="minDate" md-placeholder="Enter date"></md-datepicker> </div> <div layout="row" layout-align="start center" class="grid-datepicker" layout-padding> <span>Eind Datum: </span> <md-datepicker ng-model="maxDate" md-placeholder="Enter date"></md-datepicker> </div> </div> </section> <section ng-if="!showExportButton"> <md-button class="md-raised md-primary" ng-click="getCall(minDate, maxDate)">Haal posts op</md-button> </section> <section ng-if="showExportButton"> <md-button class="md-raised md-warn" ng-click="exportData()">Export</md-button> <div id="exportable" ng-if="showExportButton"> <table width="100%"> <thead> <tr> <th>created_time</th> <th>message</th> <th>type</th> <th>link</th> <th>permalink_url</th> <th>caption</th> <th>name</th> <th>picture</th> <th>post id</th> <th>likes</th> <th>reactions</th> <th>comments</th> <th>shares</th> </tr> </thead> <tbody> <tr ng-repeat="item in items"> <td>{{item.created_time}}</td> <td>{{item.message}}</td> <td>{{item.type}}</td> <td>{{item.link}}</td> <td>{{item.permalink_url}}</td> <td>{{item.caption}}</td> <td>{{item.name}}</td> <td>{{item.picture}}</td> <td>{{item.id}}</td> <td>{{item.likes}}</td> <td>{{item.reactions}}</td> <td>{{item.comments}}</td> <td>{{item.shares}}</td> </tr> </tbody> </table> </div> </section> </div></md-content></div>')}]);