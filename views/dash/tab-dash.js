angular.module('myApp.dashTab', ['myApp.env'])

.controller('DashCtrl', function($scope, Post, $timeout) {
$scope.posts;
 Post.getAllPosts().then(function(postsData) {
  delete postsData.connected;
  $scope.posts = postsData;
 });

  $scope.doRefresh = function() {
    angular.element('.icon-refreshing').addClass('spin');
    Post.getAllPosts().then(function(postsData) {
      delete postsData.connected;
      $scope.posts = postsData;

      $scope.$broadcast('scroll.refreshComplete');
      $timeout(function(){
        angular.element('.icon-refreshing').removeClass('spin');
      }, 500);
    }); 
  };



});