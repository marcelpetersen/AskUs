angular.module('myApp.userPage', ['myApp.env'])

.controller('userPageCtrl', ['$scope', '$stateParams', 'usersInfos', 'Post', '$timeout', '$ionicModal', '$ionicSlideBoxDelegate', function($scope, $stateParams, usersInfos, Post, $timeout, $ionicModal, $ionicSlideBoxDelegate) {
  $scope.parentCategory = $stateParams.parentCat;
  $scope.posts;
  $scope.noPost = false;
  $scope.user = usersInfos.singleUserInfoGet();
  angular.element('.loading-icon').addClass('spin');

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
     if (toState.name === "tab.user-page" || toState.name === "tab.friend-page" || toState.name === "tab.user-account-page") {
        Post.postToDelete("user-page");
     }
   });

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

  $scope.userPage = function(userId, userName, userPicture) {
    var user = {
      id: userId,
      name: userName,
      picture: userPicture
    }
    console.log(user);
    usersInfos.singleUserInfoSet(user);
  }

  $scope.postPage = function(uid, data) {
    var postData = {
      uid: uid,
      data: data
    };
    Post.singlePostInfoSet(postData);
  }

}]);