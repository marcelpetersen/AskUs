angular.module('myApp.preferences', ['myApp.env'])

.controller('preferencesCtrl', function($scope, userAuth) {
    $scope.settings = {
    enableNotifications: true
  };

  $scope.suspendAccountFacebook = function() {
    console.log('test');
    userAuth.suspendAccountFacebook();
  };

});