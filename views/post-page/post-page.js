angular.module('myApp.postPage', ['myApp.env'])

.controller('postCtrl', 
  ['$scope', 'Post', '$stateParams', 'currentUserInfos', 'Vote', '$ionicSlideBoxDelegate', '$ionicModal', '$ionicHistory', '$timeout', 'usersInfos', 
  function($scope, Post, $stateParams, currentUserInfos, Vote, $ionicSlideBoxDelegate, $ionicModal, $ionicHistory, $timeout, usersInfos) {
  
  var pageName = '#post-page';
  $scope.postDelete = {};
  $scope.postReport = {};
  $scope.parentCategory = $stateParams.parentCat;

  // Get post info
  var postData = Post.singlePostInfoGet();
  $scope.post = postData.data;

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

      (element === "A") ? post.voteATotal++ : post.voteBTotal++;

      post.totalA = Vote.calculTotalRatio(post.voteATotal, post.voteBTotal);
      post.totalB = Vote.calculTotalRatio(post.voteBTotal, post.voteATotal);

      // Add post to the update list for the Dash & Dash Filter pages
      Vote.addVoteToUpdate("dash-page", post.$key, element, post.totalA, post.totalB);
      Vote.addVoteToUpdate("dash-filter-page", post.$key, element, post.totalA, post.totalB);

      // Create the Radials
      Vote.addRadial("A", post.$key, '#33cd5f', post.totalA, 1000, pageName);
      Vote.addRadial("B", post.$key, '#387ef5', post.totalB, 1000, pageName);


    }, function(){
      angular.element(pageName +' .card[data-postid='+ post.$key +'] .vote-loading').addClass('hide');
      angular.element(pageName +' .card[data-postid='+ post.$key +'] .vote-loading .loading-icon').removeClass('spin');
      console.log("vote failed");
      // Show global error modal
      $scope.openErrorModal();
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

  $scope.reportPost = function(id) {
    Post.reportPost(id).then(function(){
      // angular.element(pageName +' .card[data-postid='+ id +']').fadeOut(500);
      $scope.reportModal.hide();
    }, function(){
      $scope.reportModal.hide();
      console.log("report failed");
      // Show global error modal
      $scope.openErrorModal();
    })
  };


  // ****** Modal functions ******
  $scope.modalPictureUpdate =  function(data) {
    $scope.aImages = [{
      'src': data.pictureA
    }, {
      'src': data.pictureB
    }];
  };

  $ionicModal.fromTemplateUrl('post-delete-modal.html', {
    scope: $scope,
    animation: 'mh-slide' //'slide-in-up'
  }).then(function(modal) {
    $scope.deleteModal = modal;
  });

  $ionicModal.fromTemplateUrl('post-report-modal.html', {
    scope: $scope,
    animation: 'mh-slide' //'slide-in-up'
  }).then(function(modal) {
    $scope.reportModal = modal;
  });

  $ionicModal.fromTemplateUrl('image-modal.html', {
    scope: $scope,
    animation: 'mh-slide' //'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.showDeleteModal = function(key, title) {
    $scope.postDelete.title = title;
    $scope.postDelete.id = key;
    $scope.deleteModal.show();
  };

  $scope.showReportModal = function(key, title) {
    $scope.postReport.title = title;
    $scope.postReport.id = key;
    $scope.reportModal.show();
  };

  $scope.closeDeleteModal = function() {
    $scope.deleteModal.hide();
  };

  $scope.closeReportModal = function() {
    $scope.reportModal.hide();
  };

  $scope.openModal = function() {
    $ionicSlideBoxDelegate.slide(0);
    $scope.modal.show();
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  $scope.goToSlide = function(index) {
    $scope.modal.show();
    $ionicSlideBoxDelegate.slide(index);
  };

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };



  
}]);