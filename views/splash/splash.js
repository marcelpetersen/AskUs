angular.module('myApp.splash', ['myApp.env'])

.controller('splashCtrl', function($scope, userAuth) {
  console.log('splash');
  $scope.login = function() {
    userAuth.loginWithFacebook();
  }
});