angular.module('myApp.dashTab', ['myApp.env'])

.controller('DashCtrl', function($scope, Post, $timeout, $rootScope) {

  console.log('Dash Ctrl First call');

  $rootScope.$on('dashRefresh', function() {
    $scope.doRefresh();
  })

  // $scope.chat = Chats.get($stateParams.chatId);

$scope.posts;
 Post.getAllPosts().then(function(postsData) {
  console.log('Dash Get Post');
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