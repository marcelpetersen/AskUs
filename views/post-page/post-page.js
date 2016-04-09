angular.module('AskUs.postPage', ['AskUs.env'])

.controller('postCtrl', 
  ['$scope', 'Post', 'Comments', '$stateParams', 'currentUserInfos', 'Vote', '$ionicSlideBoxDelegate', '$ionicModal', '$ionicHistory', '$timeout', 'usersInfos', 
  function($scope, Post, Comments, $stateParams, currentUserInfos, Vote, $ionicSlideBoxDelegate, $ionicModal, $ionicHistory, $timeout, usersInfos) {

  var pageName = '#post-page';
  $scope.postDelete = {};
  $scope.parentCategory = $stateParams.parentCat;
  $scope.postId = $stateParams.postId;
  $scope.commentSending = false;
  $scope.commentObj = {
    message: ""
  };
  $scope.currentLastPost;
  $scope.comments = {};
  $scope.noMoreData = false;
  $scope.gotPost = false;
  $scope.postFormError = false;

  var currentUser = currentUserInfos.currentUserInfoGet();

  // Get post info
  $scope.getPost = function() {
    Post.getPost($scope.postId).then(function(postData) {
      $scope.gotPost = true;
      $scope.post = postData;
      if(!$scope.post.voters) {
        $scope.post.voters = {};
      }
      $timeout(function(){
        $scope.checkVote($scope.post)
      }, 0);
    }, function() {
      // Show global error modal
      $scope.openErrorModal();
      $scope.noMoreData = true;
    });
  };

  // Store user data before redirection
  $scope.userPage = function(userId, userName, userPicture) {
    var user = {
      id: userId,
      name: userName,
      picture: userPicture
    };
    usersInfos.singleUserInfoSet(user);
  };

  $scope.doRefresh = function() {
    angular.element(pageName +' .icon-refreshing').addClass('spin');
    $scope.noMoreData = true;

    // Get the last 10 messages
    Comments.getComments($scope.postId).then(function(commentsData) {
      $scope.comments = {};
      $scope.$broadcast('scroll.refreshComplete');
      if (commentsData.number < 10) {
        $scope.comments = commentsData.values;
        $timeout(function(){
            angular.element(pageName +' .icon-refreshing').removeClass('spin');
        }, 1500);
      } else {
        // remove the first element, will be display with the next post call
        var cleanedData = Post.getAndDeleteFirstElementInObject(commentsData.values);
        $scope.currentLastPost = cleanedData.currentLastPost
        $scope.comments = cleanedData.obj;
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
    if (!$scope.currentLastPost) {
      angular.element(pageName +' ion-infinite-scroll').css('margin-top', ((screen.height / 2) - 90) + 'px');
      // Get the previous last 10 posts
      Comments.getComments($scope.postId).then(function(commentsData) {

        if (commentsData.number < 10) {
          $scope.comments = commentsData.values;
          $scope.noMoreData = true;
        } else {
          // Delete the last element, will be added by the next loadmore call (Firebase returns the last element of the time range)
          var cleanedData = Post.getAndDeleteFirstElementInObject(commentsData.values);
          // Get the last element timestamp
          $scope.currentLastPost = cleanedData.currentLastPost
          $scope.comments = cleanedData.obj;
        }

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
      Comments.getCommentsInfinite($scope.postId, $scope.currentLastPost).then(function(commentsData) {

        var firstElement = Post.getFirstElementInObject(commentsData.values);
        var currentLastPostTemp = firstElement.currentLastPost;
        var lastPostId = firstElement.id;

        // Check if the last post is equal to the previous one, so the last post in the DB
        if ($scope.currentLastPost === currentLastPostTemp) {
          $scope.noMoreData = true;
          var updatedPostFinal = angular.extend({}, $scope.comments, commentsData.values)
          $scope.comments = updatedPostFinal;
        } else {
          $scope.currentLastPost = currentLastPostTemp;
          // Delete the element because already exist in the original Data
          delete commentsData[lastPostId];
          var updatedPost = angular.extend({}, $scope.comments, commentsData.values)
          $scope.comments = updatedPost;
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

    // ****** Vote functions ******
  $scope.vote = function(post, element) {
    angular.element(pageName + '.'+ $scope.parentCategory +' .card[data-postid='+ $scope.postId +'] .vote-loading .loading-icon').addClass('spin');
    angular.element(pageName + '.'+ $scope.parentCategory +' .card[data-postid='+ $scope.postId +'] .vote-loading').removeClass('hide');
    Vote.addVote($scope.postId, element).then(function(){
      angular.element(pageName + '.'+ $scope.parentCategory +' .card[data-postid='+ $scope.postId +'] .vote-loading .loading-icon').removeClass('spin');
      angular.element(pageName + '.'+ $scope.parentCategory +' .card[data-postid='+ $scope.postId +']').addClass('voted voted-'+ element);

      // Hide voting button block and show radials
      post.hasVoted = true;

      // Increase votes and get the ratios
      (element === "A") ? post.voteATotal++ : post.voteBTotal++;
      post.totalA = Vote.calculTotalRatio(post.voteATotal, post.voteBTotal);
      post.totalB = Vote.calculTotalRatio(post.voteBTotal, post.voteATotal);

      // // Update post object
      // $scope.post.voters[currentUser.id] = element;

      // Add post to the update list for the Dash & Dash Filter pages
      Vote.addVoteToUpdate("dash-page", $scope.postId, element, post.totalA, post.totalB);
      Vote.addVoteToUpdate("dash-filter-page", $scope.postId, element, post.totalA, post.totalB);

      // Create the Radials
      Vote.addRadial("A", $scope.postId, '#33cd5f', post.totalA, 1000, pageName + '.'+ $scope.parentCategory);
      Vote.addRadial("B", $scope.postId, '#387ef5', post.totalB, 1000, pageName + '.'+ $scope.parentCategory);

    }, function(error){
      angular.element(pageName + '.'+ $scope.parentCategory +' .card[data-postid='+ $scope.postId +'] .vote-loading').addClass('hide');
      angular.element(pageName + '.'+ $scope.parentCategory +' .card[data-postid='+ $scope.postId +'] .vote-loading .loading-icon').removeClass('spin');
      console.log("vote failed");
      if (error.noPost) {
        $scope.openNoPostModal();

        // Add post to the delete list for the Dash & Dash Filter & user pages
        Post.addPostToDelete("dash-page", $scope.postId);
        Post.addPostToDelete("dash-filter-page", $scope.postId);
        Post.addPostToDelete("user-page", $scope.postId);
        Post.addPostToDelete("my-votes-page", $scope.postId);

        // Go Back to the previous view
        $ionicHistory.goBack();
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
            angular.element(pageName + '.'+ $scope.parentCategory +' .card[data-postid='+ $scope.postId +']').addClass('voted voted-'+ post.voters[currentUser.id]);
            Vote.addRadial("A", $scope.postId, '#33cd5f', post.totalA, 1, pageName + '.'+ $scope.parentCategory);
            Vote.addRadial("B", $scope.postId, '#387ef5', post.totalB, 1, pageName + '.'+ $scope.parentCategory);
          }, 0);    
        }
      }
    // check if user own post
    if (post.userId === currentUser.id) {
      $timeout(function(){
        angular.element(pageName +' .card[data-postid='+ $scope.postId +']').addClass('my-post');
      }, 0);
    }
  };

  $scope.deletePost = function(id) {
    Post.deletePost(id).then(function(){
      angular.element(pageName +' .card[data-postid='+ id +']').fadeOut(500);
      $scope.deleteModal.hide();

      // Add post to the delete list for the Dash & Dash Filter & user pages
      Post.addPostToDelete("dash-page", id);
      Post.addPostToDelete("dash-filter-page", id);
      Post.addPostToDelete("user-page", id);
      Post.addPostToDelete("my-votes-page", id);

      // Go Back to the previous view
      $ionicHistory.goBack();
    }, function(){
      $scope.deleteModal.hide();
      console.log("delete failed");
      // Show global error modal
      $scope.openErrorModal();
    })
  };

  angular.element('body').on('focus', '.message-textarea', function() {
    angular.element('.form-modal').addClass('focus')
  })

  angular.element('body').on('focusout', '.message-textarea', function() {
    angular.element('.form-modal').removeClass('focus')
  })

  // Add Message function
  $scope.submitMessage = function(form) {
    // Show comment sending loading block
    angular.element('.form-modal .btn-form-submit').prop("disabled",true);
    $scope.commentSending = true;
    // Check if the form is fully filled
    if(form.$valid && $scope.commentObj.message !== "") {
      $scope.postFormError = false;
      // Show loading message
      angular.element('.form-modal .message-input-loading .loading-icon').addClass('spin');

      Comments.addComment($scope.postId, $scope.commentObj.message).then(function(){

        // Hide comment sending loading block
        $scope.commentSending = false;

        angular.element('.form-modal .message-input-loading .loading-icon').removeClass('spin');

        // Increase comments number displayed
        $scope.post.totalMessages++;

        $scope.commentObj = {
          message: ""
        };

        $scope.doRefresh();
        $scope.closeFormModal();
        angular.element('.form-modal .btn-form-submit').prop("disabled",false);
      }, function(error){
        angular.element('.form-modal .message-input-loading .loading-icon').removeClass('spin');
        console.log("Comment failed");
        // Hide comment sending loading block
        $scope.commentSending = false;
        if (error.noPost) {
          $scope.closeFormModal();
          angular.element('.form-modal .btn-form-submit').prop("disabled",false);
          $scope.openNoPostModal();

          // Add post to the delete list for the Dash & Dash Filter & user pages
          Post.addPostToDelete("dash-page", $scope.postId);
          Post.addPostToDelete("dash-filter-page", $scope.postId);
          Post.addPostToDelete("user-page", $scope.postId);
          Post.addPostToDelete("my-votes-page", $scope.postId);

          // Go Back to the previous view
          $ionicHistory.goBack();
        } else {
          $scope.closeFormModal();
          angular.element('.form-modal .btn-form-submit').prop("disabled",false);
          // Show global error modal
          $scope.openErrorModal();
        }
      })
    } else {
      // Show the form empty fields error
      $scope.postFormError = true;
      console.log('Form submit error');
      // Hide comment sending loading block
      $scope.commentSending = false;
    }
  }; 

  // ****** Modal functions ******
  // --- Delete Modal Form ---
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

  // --- Comment Modal Form ---
  $ionicModal.fromTemplateUrl('display-form.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.formModal = modal;
  });

  $scope.openFormModal = function() {
    $scope.formModal.show();
  };

  $scope.closeFormModal = function() {
    $scope.formModal.hide();
  };

}]);