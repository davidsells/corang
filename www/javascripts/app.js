/**
 *
 * Created by david on 26/02/14.
 */
'use strict';

var myApp = angular.module('myApp', [
    'ngRoute',
    'myApp.controllers',
    'ngResource',
    'mongolabResource'
]);

myApp.constant('API_KEY', '0sWuwdp3xtjPaeC_SnwMcRXc3QYrcblR');
myApp.constant('DB_NAME', 'persistentdesigns');


myApp.filter('blankquestionfilter', function() {
    return function(items) {
        return items.filter(function(element, index, array) {
            var question = element.question;
            return  !(!question || '' === question);
        });

    };
});

/*
 myApp.constant('_', _);
 */

myApp.config(['$routeProvider', function ($routeProvider ) {
    $routeProvider.when('/polls', {templateUrl: 'views/poll-list.html', controller: 'PollListCtrl'});
    $routeProvider.when('/new', {templateUrl: 'views/new.html', controller: 'PollNewCtrl'});
    $routeProvider.when('/poll/:pollId', {templateUrl: 'views/poll-item.html', controller: 'PollItemCtrl'});
    $routeProvider.when('/delete/:pollId', {templateUrl: 'views/poll-list.html', controller: 'PollDeleteCtrl'});
    $routeProvider.otherwise({redirectTo: '/polls'});
}]);


myApp.factory('PollFactory', function($mongolabResource) {
    return $mongolabResource('polls');
});
