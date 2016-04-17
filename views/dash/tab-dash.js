angular.module('AskUs.dashTab', ['AskUs.env'])

.controller('DashCtrl', 
  ['$scope', '$state', 'Search', '$ionicScrollDelegate', '$ionicSideMenuDelegate', 'Post', '$timeout', '$rootScope', '$ionicModal', '$ionicSlideBoxDelegate', 'usersInfos', 'Vote', 'currentUserInfos', '$ionicNavBarDelegate', 
  function($scope, $state, Search, $ionicScrollDelegate, $ionicSideMenuDelegate, Post, $timeout, $rootScope, $ionicModal, $ionicSlideBoxDelegate, usersInfos, Vote, currentUserInfos, $ionicNavBarDelegate) {

  var pageName = '#dash-page';
  $scope.pageOriginName = 'dash';
  $scope.posts;
  $scope.aImages;
  $scope.noMoreData = false;
  $scope.currentLastPost;
  $scope.postDelete = {};
  // Search Variables
  $scope.searchPostsResults = {};
  $scope.searchUsersResults = {};
  $scope.noPostsResults = false;
  $scope.noUsersResults = false;
  $scope.searchPost = true;

  // Check the Post to delete and update when coming back to the page
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if (toState.name === "tab.dash") {
      Vote.voteUpdate("dash-page");
      Post.postToDelete("dash-page");
    }
  });

  // Open / Close side menu
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  // Refresh the page after addding a new post
  $rootScope.$on('dashRefresh', function() {
    $scope.doRefresh();
    $ionicScrollDelegate.scrollTop();
  });

  // Pull to refresh method
  $scope.doRefresh = function() {
    angular.element(pageName +' .icon-refreshing').addClass('spin');
    $scope.noMoreData = true;
    angular.element(pageName +' .no-more-cards').addClass('hide-refresh');

    // Get the lastest 7 posts
    Post.getAllPosts().then(function(postsData) {
      $scope.posts = {};
      // remove the first element, will be display with the next post call
      var cleanedData = Post.getAndDeleteFirstElementInObject(postsData);
      $scope.currentLastPost = cleanedData.currentLastPost;
      $scope.posts = cleanedData.obj;
      $scope.$broadcast('scroll.refreshComplete');

      $timeout(function(){
        $scope.noMoreData = false;
        angular.element(pageName +' .no-more-cards').removeClass('hide-refresh');
        angular.element(pageName +' .icon-refreshing').removeClass('spin');
      }, 1500);
    }, function() {
      $scope.openErrorModal();
      $scope.$broadcast('scroll.refreshComplete');
      angular.element(pageName +' .no-more-cards').removeClass('hide-refresh');
      angular.element(pageName +' .icon-refreshing').removeClass('spin');
    }); 
  };

  $scope.loadMore = function() {
    angular.element(pageName +' .icon-refreshing').addClass('spin');
    if (!$scope.currentLastPost) {
      angular.element(pageName +' ion-infinite-scroll').css('margin-top', ((screen.height / 2) - 90) + 'px');
      // Get the previous last 7 posts
      Post.getAllPosts().then(function(postsData) {
        // Delete the last element, will be added by the next loadmore call (Firebase returns the last element of the time range)
        var cleanedData = Post.getAndDeleteFirstElementInObject(postsData);
        // Get the last element timestamp
        $scope.currentLastPost = cleanedData.currentLastPost;
        $scope.posts = cleanedData.obj;

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
      Post.getAllPostsInfinite($scope.currentLastPost).then(function(postsData) {
        var firstElement = Post.getFirstElementInObject(postsData);
        var currentLastPostTemp = firstElement.currentLastPost;
        var lastPostId = firstElement.id;

        // Check if the last post is equal to the previous one, so the last post in the DB
        if ($scope.currentLastPost === currentLastPostTemp) {
          $scope.noMoreData = true;
          var updatedPostFinal = angular.extend({}, $scope.posts, postsData);
          $scope.posts = updatedPostFinal;
        } else {
          $scope.currentLastPost = currentLastPostTemp;
          // Delete the element because already exist in the original Data
          delete postsData[lastPostId];
          var updatedPost = angular.extend({}, $scope.posts, postsData);
          $scope.posts = updatedPost;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
        angular.element(pageName +' .icon-refreshing').removeClass('spin');
        
      }, function() {
        // Show global error modal
        $scope.openErrorModal();
        $scope.noMoreData = true;
        $scope.$broadcast('scroll.infiniteScrollComplete');
        angular.element(pageName +' .icon-refreshing').removeClass('spin');
      });
    }
  };

  // ****** Next page functions ******
  // Store user infos before redirection
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

  // ****** Search functions ******
  $scope.submitSearch = function(form, searchByPost) {
    var resultsContainer = angular.element('.posts-results-container').offset();
    angular.element('.posts-results-container .list').css('height', screen.height - resultsContainer.top + 'px');
    var searchByItem;
    var searchByKey;
    if (searchByPost) {
      $scope.searchPostsResults = {};
      searchByKey = 'title',
      searchByItem = '/posts'
    } else {
      $scope.searchUsersResults = {};
      searchByKey = 'displayName',
      searchByItem = '/users'
    }

    if(form.$valid) {
      Search.searchFunction(form.term, searchByItem, searchByKey).then(function(searchData){
        if (searchByPost) {
          $scope.searchPostsResults = searchData;
          $scope.noPostsResults = false;  
        } else {
          $scope.searchUsersResults = searchData;
          $scope.noUsersResults = false; 
        }
      }, function(error) {
          if (searchByPost) {
            $scope.noPostsResults = true; 
          } else {
            $scope.noUsersResults = true; 
          }
      })
    }
  }

  // ****** Delete post function ******
  $scope.deletePost = function(id) {
    Post.deletePost(id).then(function(){
      angular.element(pageName +' .card[data-postid='+ id +']').fadeOut(500);
      $scope.deleteModal.hide();

      Post.addPostToDelete("my-votes-page", id);
      Post.addPostToDelete("user-page", id);
    }, function(){
      $scope.deleteModal.hide();
      //console.log("delete failed");
      // Show global error modal
      $scope.openErrorModal();
    })
  };

  // ****** Modal functions ******
  // Delete post modal
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

  // Post or user search modal
  $ionicModal.fromTemplateUrl('search-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.searchModal = modal;
  });

  $scope.showSearchModal = function(key, title) {
    $scope.postDelete.title = title;
    $scope.postDelete.id = key;
    $scope.searchModal.show();
  };

  $scope.closeSearchModal = function() {
    $scope.searchModal.hide();
  };

}]);