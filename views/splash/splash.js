angular.module('myApp.splash', ['myApp.env'])

.controller('splashCtrl', function($scope, userAuth) {
  
  // Set first section height
  var windowHeight = $(window).height();
  $('.section.first').height(windowHeight);


  $scope.login = function() {
    userAuth.loginWithFacebook();
  }
});