angular.module('myApp.userPage', ['myApp.env'])

.controller('userPageCtrl', ['$scope', '$stateParams', 'usersInfos', 'Post', '$timeout', function($scope, $stateParams, usersInfos, Post, $timeout) {
  // $scope.chat = Chats.get($stateParams.chatId);
  $scope.posts;
  $scope.noPost = false;
  $scope.user = usersInfos.singleUserInfoGet();
  angular.element('.loading-icon').addClass('spin');

  Post.getPostsById($scope.user.id).then(function(postsData) {
    if (!!postsData) {
      $scope.posts = postsData;
    } else {
      $scope.noPost = true;
    }
    angular.element('.loading-icon').hide().removeClass('spin');
    angular.element('.loading').hide();
    angular.element('ion-infinite-scroll').css('margin-top', '0px');
  })

  $scope.doRefresh = function() {
    angular.element('.icon-refreshing').addClass('spin');
    Post.getPostsById($scope.user.id).then(function(postsData) {
      if (!!postsData) {
        $scope.posts = postsData;
      } else {
        $scope.noPost = true;
      }

      $scope.$broadcast('scroll.refreshComplete');
      $timeout(function(){
        angular.element('.icon-refreshing').removeClass('spin');
      }, 500);
    }); 
  };


}]);