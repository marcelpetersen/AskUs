angular.module('AskUs.dashFilterTab', ['AskUs.env'])

.controller('DashFilterCtrl', 
  ['$scope', '$stateParams', '$state', '$ionicSideMenuDelegate', 'Categories', 'Post', '$timeout', '$rootScope', '$ionicModal', '$ionicSlideBoxDelegate', 'usersInfos', 'Vote', 'currentUserInfos', 
  function($scope, $stateParams, $state, $ionicSideMenuDelegate, Categories, Post, $timeout, $rootScope, $ionicModal, $ionicSlideBoxDelegate, usersInfos, Vote, currentUserInfos) {

  var pageName = '#dash-filter-page';
  $scope.pageOriginName = 'dash';
  $scope.posts;
  $scope.aImages;
  $scope.noMoreData = false;
  $scope.noPost = false;
  $scope.postDelete = {};

  var newPostLimit = 6;
  var postTotalMax = 0;
  var totalPostNumber = 0;
  var totalPost;
  var displayedPost;

  // Get route parent
  $scope.parentCategory = $stateParams.filter;

  // Close menu
  $ionicSideMenuDelegate.toggleLeft(false);

  // Check the Post to delete and update when coming back to the page
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
     if (toState.name === "tab.dash-filter") {
        Vote.voteUpdate("dash-filter-page");
        Post.postToDelete("dash-filter-page");
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

    Categories.getAllPostsByCategory($stateParams.filter, newPostLimit).then(function(postsData) {
      $scope.posts = {};
      // Increase the total possible number of posts displayed
      postTotalMax += newPostLimit;
      $scope.posts = postsData.values;
      totalPostNumber = postsData.number;
      $scope.$broadcast('scroll.refreshComplete');

      if( totalPostNumber === 0) {
        $scope.noPost = true;
      }

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
      angular.element(pageName +' ion-infinite-scroll').css('margin-top', ((screen.height / 2) - 90) + 'px');
      // Get the previous last 5 posts
      Categories.getAllPostsByCategory($stateParams.filter, newPostLimit).then(function(postsData) {
        // Increase the total possible number of posts displayed
        postTotalMax += newPostLimit;
        // Check the number of cards retreive
        totalPostNumber = postsData.number;

        if (totalPostNumber === 0) {
          $scope.noPost = true;
        }

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
      Categories.getAllPostsByCategoryInfinite($stateParams.filter, totalPostNumber, newPostLimit).then(function(postsData) {
        postTotalMax += newPostLimit;
        totalPostNumber = postsData.number;
        var newObjToAdd;
        var updatedPost;
        // Less posts than the max possible, then the is no more post available
        if( postsData.number !== postTotalMax ) {
          $scope.noMoreData = true;
          newObjToAdd = Categories.getFirstXElements(postsData.values , newPostLimit - (postTotalMax - postsData.number))
        } else {
          newObjToAdd = Categories.getFirstXElements(postsData.values , newPostLimit)
        }
        updatedPost = angular.extend({}, $scope.posts, newObjToAdd);
        $scope.posts = updatedPost;
        $scope.$broadcast('scroll.infiniteScrollComplete');
        angular.element(pageName +' .icon-refreshing').removeClass('spin');
      }, function() {        
        // Show global error modal
        $scope.openErrorModal();
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.noMoreData = true;
        angular.element(pageName +' .icon-refreshing').removeClass('spin');
      })
    }
  };

  // ****** Next page functions ******
  $scope.userPage = function(userId, userName, userPicture) {
    var user = {
      id: userId,
      name: userName,
      picture: userPicture
    };
    usersInfos.singleUserInfoSet(user);
  };

  // ****** Vote functions ******
  // Save User's vote and display results
  $scope.vote = function(post, element) {
    Vote.postVote(post, element, pageName, $scope);
  }

  // Check User's vote
  $scope.checkVote = function(post) {
    Vote.checkVote(post, pageName);
  };

  $scope.deletePost = function(id) {
    Post.deletePost(id).then(function(){
      angular.element(pageName +' .card[data-postid='+ id +']').fadeOut(500);
      $scope.deleteModal.hide();

      // Add post to the delete list for the Dash & Dash Filter & user pages
      Post.addPostToDelete("dash-page", id);
      Post.addPostToDelete("my-votes-page", id);
      Post.addPostToDelete("user-page", id);

    }, function(){
      $scope.deleteModal.hide();
      // console.log("delete failed");
      // Show global error modal
      $scope.openErrorModal();
    })
  };

  $ionicModal.fromTemplateUrl('post-delete-modal.html', {
    scope: $scope,
    animation: 'mh-slide' //'slide-in-up'
  }).then(function(modal) {
    $scope.deleteModal = modal;
  });

  $scope.showDeleteModal = function(key, title) {
    $scope.postDelete.title = title;
    $scope.postDelete.id = key;
    $scope.deleteModal.show();
  };

  $scope.closeDeleteModal = function() {
    $scope.deleteModal.hide();
  };

}]);