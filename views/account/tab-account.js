angular.module('myApp.acountTab', ['myApp.env'])

.controller('AccountCtrl', function($scope, userAuth) {

  $scope.logoutFacebook = function() {
    userAuth.logoutFacebook();
  };

});