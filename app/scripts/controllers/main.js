'use strict';

angular.module('hackfeedApp')
  .controller('MainCtrl', ['$scope', '$rootScope', '$firebase', function ($scope, $rootScope, $firebase) {

    var sessionsRef = new Firebase("https://huh.firebaseio.com/sessions");
    $scope.sessions = $firebase(sessionsRef);
    var key = $scope.sessions.$getIndex();
    console.log(key.length);
    $scope.currentSession = "";

    $scope.addSession = function() {
      if ($scope.title) {
        $scope.currentSession = {
          "title": $scope.title,
          "uid": 1,
          "authorName": "marcel",
          "startedAt": new Date(),
          "avatarUrl": "http://"
        }
        $scope.sessions.$add($scope.currentSession);
        $scope.sessionStarted = true;
        $scope.title = "";
      }
    }
    
    $scope.endSession = function() {
      $scope.currentSession.endedAt = new Date();
      $scope.sessions.$add($scope.currentSession);
      $scope.sessionStarted = false;
    }
  }]);
