angular.module('myApp.dashTab', ['myApp.env'])

.controller('DashCtrl', 
  ['$scope', '$state', '$ionicScrollDelegate', '$ionicSideMenuDelegate', 'Post', '$timeout', '$rootScope', '$ionicModal', '$ionicSlideBoxDelegate', 'usersInfos', 'Vote', 'currentUserInfos', 
  function($scope, $state, $ionicScrollDelegate, $ionicSideMenuDelegate, Post, $timeout, $rootScope, $ionicModal, $ionicSlideBoxDelegate, usersInfos, Vote, currentUserInfos) {

  var pageName = '#dash-page';
  $scope.posts;
  $scope.aImages;
  $scope.noMoreData = false;
  $scope.currentLastPost;
  $scope.postDelete = {};

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
    $scope.noMoreData = false;
    $scope.currentLastPost = null;
    // Get the last 10 posts
    Post.getAllPosts().then(function(postsData) {
      // remove the first element, will be display with the next post call
      var cleanedData = Post.getAndDeleteFirstElementInObject(postsData);
      $scope.currentLastPost = cleanedData.currentLastPost
      $scope.posts = cleanedData.obj;
    }, function() {
      $scope.openErrorModal();
      $scope.noMoreData = true;
    }); 
    $scope.$broadcast('scroll.refreshComplete');
    $timeout(function(){
        angular.element(pageName +' .icon-refreshing').removeClass('spin');
    }, 500);
  };

  $scope.loadMore = function() {
    angular.element(pageName +' .icon-refreshing').addClass('spin');
    if (!$scope.currentLastPost) {
      angular.element(pageName +' ion-infinite-scroll').css('margin-top', ((screen.height / 2) - 90) + 'px');
      // Get the previous last 10 posts
      Post.getAllPosts().then(function(postsData) {
        // Delete the last element, will be added by the next loadmore call (Firebase returns the last element of the time range)
        var cleanedData = Post.getAndDeleteFirstElementInObject(postsData);
        // Get the last element timestamp
        $scope.currentLastPost = cleanedData.currentLastPost
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
          var updatedPostFinal = angular.extend({}, $scope.posts, postsData)
          $scope.posts = updatedPostFinal;
        } else {
          $scope.currentLastPost = currentLastPostTemp;
          // Delete the element because already exist in the original Data
          delete postsData[lastPostId];
          var updatedPost = angular.extend({}, $scope.posts, postsData)
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
  // Store user info before redirection
  $scope.userPage = function(userId, userName, userPicture) {
    var user = {
      id: userId,
      name: userName,
      picture: userPicture
    };
    usersInfos.singleUserInfoSet(user);
  };

  // ****** Vote functions ******
  $scope.vote = function(post, element) {
    angular.element(pageName +' .card[data-postid='+ post.$key +'] .vote-loading .loading-icon').addClass('spin');
    angular.element(pageName +' .card[data-postid='+ post.$key +'] .vote-loading').removeClass('hide');
    Vote.addVote(post.$key, element).then(function(){
      angular.element(pageName +' .card[data-postid='+ post.$key +'] .vote-loading .loading-icon').removeClass('spin');
      angular.element(pageName +' .card[data-postid='+ post.$key +']').addClass('voted voted-'+ element);

      // Hide voting button block and show radials
      post.hasVoted = true;

      // Keep for now
      // angular.element(pageName +' .card[data-postid='+ post.$key +'] .vote-buttons-container').hide();
      // angular.element(pageName +' .card[data-postid='+ post.$key +'] .results-container').fadeIn();

      // Increase votes and get the ratios
      (element === "A") ? post.voteATotal++ : post.voteBTotal++;
      post.totalA = Vote.calculTotalRatio(post.voteATotal, post.voteBTotal);
      post.totalB = Vote.calculTotalRatio(post.voteBTotal, post.voteATotal);

      // Create the Radials
      Vote.addRadial("A", post.$key, '#33cd5f', post.totalA, 1000, pageName);
      Vote.addRadial("B", post.$key, '#387ef5', post.totalB, 1000, pageName);

    }, function(error){
      angular.element(pageName +' .card[data-postid='+ post.$key +'] .vote-loading').addClass('hide');
      angular.element(pageName +' .card[data-postid='+ post.$key +'] .vote-loading .loading-icon').removeClass('spin');
      console.log("vote failed");
      if (error.noPost) {
        $scope.openNoPostModal();

        // Add post to the delete list for the Dash & Dash Filter & user pages
        Post.addPostToDelete("dash-filter-page", post.$key);
        Post.addPostToDelete("user-page", post.$key);
        Post.addPostToDelete("my-votes-page", post.$key);

        angular.element(pageName +' .card[data-postid='+ post.$key +']').fadeOut();
      } else {
        // Show global error modal
        $scope.openErrorModal();
      }
    })
  };

  $scope.checkVote = function(post) {
    var currentUser = currentUserInfos.currentUserInfoGet();
    // Check if user has vote this post
    if (post.voters) {
      if (post.voters[currentUser.id]) {
        post.totalA = Vote.calculTotalRatio(post.voteATotal, post.voteBTotal);
        post.totalB = Vote.calculTotalRatio(post.voteBTotal, post.voteATotal);
        // Timeout required for updating the view and render the radials
        $timeout(function(){
          //Show Radial block hide Buttons
          post.hasVoted = true;
          angular.element(pageName +' .card[data-postid='+ post.$key +']').addClass('voted voted-'+ post.voters[currentUser.id]);

          // Keep for now
          // angular.element(pageName +' .card[data-postid='+ post.$key +'] .vote-buttons-container').hide();
          // angular.element(pageName +' .card[data-postid='+ post.$key +'] .results-container').show();
          Vote.addRadial("A", post.$key, '#33cd5f', post.totalA, 1, pageName);
          Vote.addRadial("B", post.$key, '#387ef5', post.totalB, 1, pageName);
        }, 0);    
      }
    }
    // check if user own post
    if (post.userId === currentUser.id) {
      $timeout(function(){
        angular.element(pageName +' .card[data-postid='+ post.$key +']').addClass('my-post');
      }, 0);
    }
  };

  $scope.deletePost = function(id) {
    Post.deletePost(id).then(function(){
      angular.element(pageName +' .card[data-postid='+ id +']').fadeOut(500);
      $scope.deleteModal.hide();
    }, function(){
      $scope.deleteModal.hide();
      console.log("delete failed");
        // Show global error modal
        $scope.openErrorModal();
    })
  };

  // ****** Modal functions ******
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