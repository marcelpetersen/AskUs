angular.module('AskUs.voteService', [])

.factory('Vote', ['$q', '$rootScope', '$timeout', 'FirebaseUrl', 'currentUserInfos', 'Post', function($q, $rootScope, $timeout, FirebaseUrl, currentUserInfos, Post) {

  resolve = function(errval, retval, deferred) {
    $rootScope.$apply(function() {
      if (errval) {
        deferred.reject(errval);
      } else {
        deferred.resolve(retval);
      }
    });
  };

  // List ob post to update when commin back to previous pages
  var voteUpdateList = {
    'dash-page':{},
    'dash-filter-page': {}
  };

  return {
    addVote: function(postId, element) {
      var user = currentUserInfos.currentUserInfoGet();
      var deferred = $q.defer();

      var voterInfo = {};
      voterInfo[user.id] = element;

      var firebase = new Firebase(FirebaseUrl + '/posts/' + postId);
      firebase.once('value', function(snapshot, error) {
        if (snapshot.exists()) {
          firebase.child("voters").update(voterInfo, function(snapshot, error) {
            if(!error){
              //console.log("vote ok")
              firebase.child('vote'+element+'Total').transaction(function(element) {
                return element+1;
              }, function(error, committed, snapshot) {
                if (error) {
                  resolve(error, null, deferred);
                  //console.log('Transaction failed abnormally!', error);
                } else if (!committed) {
                  resolve(error, null, deferred);
                  //console.log('Vote not saved  (because already exists).');
                } else {
                  resolve(null, 'ok', deferred);
                  //console.log('vote saved db!');
                }
              });
            } else {
              resolve(error, null, deferred);
              //console.log("vote ko");
            }
          });
        } else {
          var noPostErr = {noPost: true} 
          resolve(noPostErr, null, deferred);
          //console.log("post doesn't exist anymore");
        }
      })
      promise = deferred.promise;
      return promise;
    },

    addRadial: function(element, key, color, total, duration, pageName) {
      var radial = new RadialProgressChart(pageName + ' .results-'+ element +'[data-postid='+ key +']', {
        diameter: 80,
        max: 100,
        round: false,
        series: [{
          value: total,
          color: '#FF4E50' //color
        }],
        animation: {
            duration: duration
        },
         shadow: {
            width: 1
        },
        stroke: {
            width: 10,
            gap: 2
        },
        center: function(d) {
          return total + ' %'
        }
      });
      return radial;
    },

    calculTotalRatio: function(a, b) {
      return Math.round(a * 100 /(a + b));
    },

    addVoteToUpdate: function(view, id, element, totalA, totalB) {
      voteUpdateList[view][id] = {
        element: element,
        totalA: totalA,
        totalB: totalB
      };
    },

    getVoteUpdateList: function() {
      return voteUpdateList;
    },

    postVote: function(post, element, pageName, scope, postId) {
      if (postId) {
        post.$key = postId;
      }

      angular.element(pageName +' .card[data-postid='+ post.$key +'] .vote-loading .loading-icon').addClass('spin');
      angular.element(pageName +' .card[data-postid='+ post.$key +'] .vote-loading').removeClass('hide');
      var that = this;
      this.addVote(post.$key, element).then(function(){
        angular.element(pageName +' .card[data-postid='+ post.$key +'] .vote-loading .loading-icon').removeClass('spin');
        angular.element(pageName +' .card[data-postid='+ post.$key +']').addClass('voted voted-'+ element);

        // Hide voting button block and show radials
        post.hasVoted = true;

        // Increase votes and get the ratios
        (element === "A") ? post.voteATotal++ : post.voteBTotal++;
        post.totalA = that.calculTotalRatio(post.voteATotal, post.voteBTotal);
        post.totalB = that.calculTotalRatio(post.voteBTotal, post.voteATotal);

        // Add post to the update list
        if(pageName === "#dash-filter-page") {
          that.addVoteToUpdate("dash-page", post.$key, element, post.totalA, post.totalB);
        } else if (pageName === "#post-page") {
          that.addVoteToUpdate("dash-page", post.$key, element, post.totalA, post.totalB);
          that.addVoteToUpdate("dash-filter-page", post.$key, element, post.totalA, post.totalB);
        }

        // Create the Radials
        that.addRadial("A", post.$key, '#33cd5f', post.totalA, 1000, pageName);
        that.addRadial("B", post.$key, '#387ef5', post.totalB, 1000, pageName);

      }, function(error){
        angular.element(pageName +' .card[data-postid='+ post.$key +'] .vote-loading').addClass('hide');
        angular.element(pageName +' .card[data-postid='+ post.$key +'] .vote-loading .loading-icon').removeClass('spin');
        //console.log("vote failed");
        if (error.noPost) {
          scope.openNoPostModal();

          // Add post to the delete list for the Dash & Dash Filter & user pages
          Post.addPostToDelete("dash-filter-page", post.$key);
          Post.addPostToDelete("user-page", post.$key);
          Post.addPostToDelete("my-votes-page", post.$key);
          Post.addPostToDelete("dash-page", post.$key);

          angular.element(pageName +' .card[data-postid='+ post.$key +']').fadeOut();
        } else {
          // Show global error modal
          scope.openErrorModal();
        }
      })
    },

    checkVote: function(post, pageName, postId) {
      if (postId) {
        post.$key = postId;
      }

      var currentUser = currentUserInfos.currentUserInfoGet();
      // Check if user has vote this post
      if (post.voters) {
        if (post.voters[currentUser.id]) {
          post.totalA = this.calculTotalRatio(post.voteATotal, post.voteBTotal);
          post.totalB = this.calculTotalRatio(post.voteBTotal, post.voteATotal);
          // Timeout required for updating the view and render the radials
          var that = this;
          $timeout(function(){
            //Show Radial block hide Buttons
            post.hasVoted = true;
            angular.element(pageName +' .card[data-postid='+ post.$key +']').addClass('voted voted-'+ post.voters[currentUser.id]);
            // Add radials votes results
            that.addRadial("A", post.$key, '#33cd5f', post.totalA, 1, pageName);
            that.addRadial("B", post.$key, '#387ef5', post.totalB, 1, pageName);
          }, 0);    
        }
      }
      // check if user own post
      if (post.userId === currentUser.id) {
        $timeout(function(){
          angular.element(pageName +' .card[data-postid='+ post.$key +']').addClass('my-post');
        }, 0);
      }
    },

    voteUpdate: function(pageName) {
      for (var key in voteUpdateList[pageName]) {
          //Show Radial block hide Buttons
          angular.element('#' + pageName +' .card[data-postid='+ key +']').addClass('voted voted-'+ voteUpdateList[pageName][key].element);
          angular.element('#' + pageName +' .card[data-postid='+ key +'] .vote-buttons-container').addClass('ng-hide');
          angular.element('#' + pageName +' .card[data-postid='+ key +'] .results-container').removeClass('ng-hide');

          this.addRadial("A", key, '#33cd5f', voteUpdateList[pageName][key].totalA, 1, '#' + pageName);
          this.addRadial("B", key, '#387ef5', voteUpdateList[pageName][key].totalB, 1, '#' + pageName);
      }
      // Clear the vote to update object
      voteUpdateList[pageName] = {};
      return;
    }
  }
}]);
