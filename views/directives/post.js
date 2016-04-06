angular.module('myApp.directive', [])

.directive('post', function() {
  return {
      restrict: 'AE',
      templateUrl: 'templates/post.html'
  };
});