'use strict';

angular.module('hackfeedApp')
  .controller('MainCtrl', ['$scope', '$rootScope', '$firebase', '$cookieStore', function ($scope, $rootScope, $firebase, $cookieStore) {

    var sessionsRef = new Firebase("https://huh.firebaseio.com/sessions");
    var postsRef = new Firebase("https://wellfed.firebaseio.com/posts");
    $scope.sessions = $firebase(sessionsRef);
    $scope.posts = $firebase(postsRef);
    var key = $scope.sessions.$getIndex();
    console.log($cookieStore.get('currentSession'));
    $scope.currentSession = $cookieStore.get('currentSession');
    $scope.currentKey = $cookieStore.get('currentKey');
    $scope.sessionStarted = $cookieStore.get('sessionStarted');

    $scope.addSession = function() {
      if ($scope.title) {
        $scope.currentSession = {
          "title": $scope.title,
          "uid": $scope.currentUser.id,
          "authorName": $scope.currentUser.displayName,
          "startedAt": new Date(),
          "avatarUrl": $scope.currentUser.avatarLink
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
      current.type = "huh";
      current.priority = 0;
      current.body = "Number of huhs in "+ current.title + " is: " + $scope.currentSession.numberHuhs || 0;
      $scope.posts.$add(current);
      $scope.sessionStarted = false;
    }
  }]);
