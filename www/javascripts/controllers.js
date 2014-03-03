/**
 * Created by david on 26/02/14.
 */
'use strict';

angular.module('myApp.controllers', [])
    .factory('PollsFactory', function ($resource) {
        var Polls = $resource('https://api.mongolab.com/api/1/databases/persistentdesigns/collections/polls/:id', {
            apiKey:'0sWuwdp3xtjPaeC_SnwMcRXc3QYrcblR',
            id:'@_id.$oid'
        },{
            query: {method:'GET', params:{entryId:''}, isArray:true},
            post: {method:'POST'},
            update: {method:'PUT', params: {entryId: '@entryId'}},
            remove: {method:'DELETE'}
        });
        return Polls;
    })
    .controller('MainCtrl', ['$scope', '$rootScope', '$window', '$location', function ($scope, $rootScope, $window, $location) {
        $scope.isMobile = "blah blah";
        $scope.slide = '';
        $rootScope.back = function() {
            $scope.slide = 'slide-right';
            $window.history.back();
        }
        $rootScope.go = function(path){
            $scope.slide = 'slide-left';
            $location.url(path);
        }
    }])
    .controller('PollItemCtrl',  ['$scope', '$routeParams', 'PollsFactory', 'PollFactory','$window', function ($scope, $routeParams, PollsFactory,PollFactory,$window) {

        console.log("Entering PollItemCtrl");
        console.dir($routeParams.pollId);

        $scope.poll = PollFactory.getById($routeParams.pollId, function(poll){
            console.log("Callback to get poll");
            console.dir(poll);
        });

        $scope.vote = function() {
//            var voteObj = { poll_id: pollId, choice: choiceId };
            $scope.poll.saveOrUpdate();
        };
    }])
    .controller('PollDeleteCtrl',  ['$scope', '$routeParams', 'PollsFactory', 'PollFactory','$window','$location', function ($scope, $routeParams, PollsFactory,PollFactory,$window,$location) {
        console.log("Entering PollItemCtrl");
        console.dir($routeParams.pollId);

        $scope.poll = PollFactory.getById($routeParams.pollId, function(poll){
            console.dir(poll);
            $scope.poll.delete();
            $scope.polls = $scope.poll.query();
        });

        $location.path('/polls');

    }])
    .controller('PollListCtrl',  ['$scope', 'PollsFactory','$window', function ($scope, PollsFactory,$window) {
        $scope.polls = PollsFactory.query({}, function(polls){
            console.log($scope.polls.length);
            console.dir($scope.polls[0]._id.$oid);
            console.log($scope.polls[0]._id.toString());
        });



        /*
        $scope.vote = function() {
            var pollId = $scope.polls[0]._id,
                choiceId = $scope.polls[0].userVote;
                var voteObj = { poll_id: pollId, choice: choiceId };
        };
        */
    }])
    .controller('PollNewCtrl',  ['$scope', '$resource','PollFactory','$window', function ($scope, $resource, PollFactory,$window) {
    // Define an empty poll model object
    $scope.poll = {
        question: '',
        choices: [ { text: '' }, { text: '' }, { text: '' }]
    };

    // Method to add an additional choice option
    $scope.addChoice = function() {
        $scope.poll.choices.push({ text: '' });
    };

    // Validate and save the new poll to the database
    $scope.createPoll = function() {
        var poll = $scope.poll;

        // Check that a question was provided
        if(poll.question.length > 0) {
            var choiceCount = 0;

            // Loop through the choices, make sure at least two provided
            for(var i = 0, ln = poll.choices.length; i < ln; i++) {
                var choice = poll.choices[i];
                choice.votes = [];

                if(choice.text.length > 0) {
                    choiceCount++
                }
                choice._id = choiceCount;
            }

            poll.__v = 0;

            if(choiceCount > 1) {
                // Create a new poll from the model
                //var newPoll = new Poll(poll);

                // Call API to save poll to the database
                //newPoll.$save(function(p, resp) {





                //var newPoll = $resource('/poll/:pollId', {pollId:'@id'}, poll );


                // newPoll.saveOrUpdate(function(p, resp) {
                PollFactory.save({},poll);
                /*
                PollFactory.$save(function(p, resp) {
                    if(!p.error) {
                        // If there is no error, redirect to the main view
                        $location.path('polls');
                    } else {
                        alert('Could not create poll');
                    }
                });
                 */
            } else {
                alert('You must enter at least two choices');
            }
        } else {
            alert('You must enter a question');
        }
    };
 }]);
