angular.module('AskUs.directive', [])

.directive('post', function() {
  return {
      restrict: 'AE',
      templateUrl: 'templates/post.html'
  };
});