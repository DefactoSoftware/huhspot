'use strict';

angular.module('hackfeedApp')
  .controller('MainCtrl', ['$scope', '$rootScope', '$firebase', '$cookieStore', function ($scope, $rootScope, $firebase, $cookieStore) {

    var sessionsRef = new Firebase("https://huh.firebaseio.com/sessions");
    $scope.sessions = $firebase(sessionsRef);
    var key = $scope.sessions.$getIndex();
    console.log($cookieStore.get('currentSession'));
    $scope.currentSession = $cookieStore.get('currentSession');
    $scope.currentKey = $cookieStore.get('currentKey');
    $scope.sessionStarted = $cookieStore.get('sessionStarted');

    $scope.addSession = function() {
      if ($scope.title) {
        $scope.currentSession = {
          "title": $scope.title,
          "uid": 1,
          "authorName": "marcel",
          "startedAt": new Date(),
          "avatarUrl": "http://"
        }
        $scope.sessionStarted = true;
        $cookieStore.put('currentSession', $scope.currentSession);
        $cookieStore.put('sessionStarted', true);
        $scope.sessions.$add($scope.currentSession).then(function(ref) {
          $scope.currentKey = ref.name()
          $cookieStore.put('currentKey', $scope.currentKey);
        });;
        $scope.title = "";
      }
    }
    
    $scope.endSession = function(current) {
      current.endedAt = new Date();
      $cookieStore.put('currentKey', "");
      $cookieStore.remove('currentSession');
      $cookieStore.remove('currentKey');
      $cookieStore.remove('sessionStarted');
      sessionsRef.child($scope.currentKey).update($scope.currentSession);
      $scope.sessionStarted = false;
    }
  }]);
