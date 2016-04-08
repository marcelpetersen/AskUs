angular.module('AskUs.userPage', ['AskUs.env'])

.controller('userPageCtrl', ['$scope', '$stateParams', 'usersInfos', 'Post', '$timeout', '$ionicModal', '$ionicSlideBoxDelegate', 'Categories', function($scope, $stateParams, usersInfos, Post, $timeout, $ionicModal, $ionicSlideBoxDelegate, Categories) {
  $scope.parentCategory = $stateParams.parentCat;
  $scope.posts;
  $scope.noPost = false;
  var pageName = '#user-page';
  $scope.user = usersInfos.singleUserInfoGet();
  var newPostLimit = 6;
  var postTotalMax = 0;
  var totalPostNumber = 0;
  var totalPost;
  var displayedPost;

  // Check the Post to delete and update when coming back to the page
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
     if (toState.name === "tab.user-page" || toState.name === "tab.friend-page" || toState.name === "tab.user-account-page") {
        Post.postToDelete("user-page");
     }
  });

  $scope.doRefresh = function() {
    angular.element(pageName +' .icon-refreshing').addClass('spin');
    // Reset all data
    $scope.noMoreData = true;
    newPostLimit = 6;
    postTotalMax = 0;
    totalPostNumber = 0;
    totalPost;
    displayedPost;

    Post.getPostsById($scope.user.id, newPostLimit).then(function(postsData) {
      $scope.posts = {};
      // Increase the total possible number of posts displayed
      postTotalMax += newPostLimit;
      totalPostNumber = postsData.number;
      $scope.posts = postsData.values;
      $scope.$broadcast('scroll.refreshComplete');

      if (totalPostNumber === 0 || postsData.number < postTotalMax) {
        $scope.noMoreData = true;
        $timeout(function(){
          angular.element(pageName +' .icon-refreshing').removeClass('spin');
        }, 1500);
      } else {
        $timeout(function(){
          $scope.noMoreData = false;
          angular.element(pageName +' .icon-refreshing').removeClass('spin');
        }, 1500);
      }      
    }, function() {
      $scope.openErrorModal();
      $scope.$broadcast('scroll.refreshComplete');
      angular.element(pageName +' .icon-refreshing').removeClass('spin');
    });
  };

  $scope.loadMore = function() {
    angular.element(pageName +' .icon-refreshing').addClass('spin');
    if (totalPostNumber === 0) {
      angular.element(pageName +' ion-infinite-scroll').css('margin-top', ((screen.height / 2) - 130) + 'px');
      // Get the previous last 5 posts
      Post.getPostsById($scope.user.id, newPostLimit).then(function(postsData) {
        // Increase the total possible number of posts displayed
        postTotalMax += newPostLimit;
        // Check the number of cards retreive
        totalPostNumber = postsData.number;
        if (totalPostNumber === 0 || postsData.number < postTotalMax) {
          $scope.noMoreData = true;
        }

        $scope.posts = postsData.values;
        $scope.$broadcast('scroll.infiniteScrollComplete');
        angular.element(pageName +' .icon-refreshing').removeClass('spin');
        angular.element(pageName +' ion-infinite-scroll').css('margin-top', '0px');
      }, function() {
        // Show global error modal
        $scope.openErrorModal();
        $scope.noMoreData = true;
        $scope.$broadcast('scroll.infiniteScrollComplete');
        angular.element(pageName +' .icon-refreshing').removeClass('spin');
        angular.element(pageName +' ion-infinite-scroll').css('margin-top', '0px');
      });
    } else {
      Post.getPostsByIdInfinite($scope.user.id, totalPostNumber, newPostLimit).then(function(postsData) {
        postTotalMax += newPostLimit;
        totalPostNumber = postsData.number;
        // Less posts than the max possible, then the is no more post available
        if( postsData.number !== postTotalMax ) {
          $scope.noMoreData = true;

          newObjToAdd = Categories.getFirstXElements(postsData.values , newPostLimit - (postTotalMax - postsData.number))

        } else {
          newObjToAdd = Categories.getFirstXElements(postsData.values , newPostLimit)

          // var newObjToAdd = Categories.getFirstXElements(postsData.values , newPostLimit)
          // var updatedPost = angular.extend({}, $scope.posts, newObjToAdd);
          // $scope.posts = updatedPost;
        }
        updatedPost = angular.extend({}, $scope.posts, newObjToAdd);
        $scope.posts = updatedPost;
        $scope.$broadcast('scroll.infiniteScrollComplete');
        angular.element(pageName +' .icon-refreshing').removeClass('spin');
        // $scope.$broadcast('scroll.infiniteScrollComplete');
        // angular.element(pageName +' .icon-refreshing').removeClass('spin');
      }, function() {
        $scope.noMoreData = true;
        
        // Show global error modal
        $scope.openErrorModal();
        $scope.$broadcast('scroll.infiniteScrollComplete');
        angular.element(pageName +' .icon-refreshing').removeClass('spin');
      })
    }
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

}]);