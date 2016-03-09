angular.module('myApp.acountTab', ['myApp.env'])

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});