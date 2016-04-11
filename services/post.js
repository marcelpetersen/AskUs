angular.module('AskUs.postService', [])

.factory('Post', ['$q', '$rootScope', 'FirebaseUrl', 'currentUserInfos', '$state', function($q, $rootScope, FirebaseUrl, currentUserInfos, $state) {

  resolve = function(errval, retval, deferred) {
    $rootScope.$apply(function() {
      if (errval) {
        deferred.reject(errval);
      } else {
        deferred.resolve(retval);
      }
    });
  };

  // List ob post to delete when commin back to previous pages
  var postDeleteList = {
    'dash-page':{},
    'dash-filter-page': {},
    'user-page': {},
    'my-votes-page': {},
  };

  return {
    addPost: function(postData) {
      var deferred = $q.defer();
      var userInfo = currentUserInfos.currentUserInfoGet();
      postData.userId = userInfo.id;
      postData.userName = userInfo.displayName;
      postData.userPicture = userInfo.profileImageURL;
      postData.totalMessages = 0;
      postData.voteATotal = 0;
      postData.voteBTotal = 0;

      postData.hasVoted = false;

      var d = new Date();
      var n = d.getTime();
      postData.time = n;

      var firebase = new Firebase(FirebaseUrl + '/posts');
      firebase.push(postData, function(snapshot, error) {
        if(!error){
          resolve(null, 'ok', deferred);
        } else {
          resolve(error, null, deferred);
        }
      });
      promise = deferred.promise;
      return promise;
    },

    deletePost: function(id) {
      var deferred = $q.defer();
      var firebase = new Firebase(FirebaseUrl + '/posts/' + id);
      firebase.remove(function(error) {
        if(!error){
          resolve(null, 'ok', deferred);
        } else {
          resolve(error, null, deferred);
        }
      });
      promise = deferred.promise;
      return promise;
    },

    reportPost: function(id) {
      var deferred = $q.defer();
      var firebase = new Firebase(FirebaseUrl + '/reports');
      var userInfo = currentUserInfos.currentUserInfoGet();
      var d = new Date();
      var n = d.getTime();
      var reportObj = {
        userId: userInfo.id,
        postId: id,
        date: n
      }
      firebase.push(reportObj, function(error) {
        if(!error){
          resolve(null, 'ok', deferred);
        } else {
          resolve(error, null, deferred);
        }
      });
      promise = deferred.promise;
      return promise;
    },

    getPost: function(id) {
      var deferred = $q.defer();
      var firebase = new Firebase(FirebaseUrl + '/posts/' + id );
      firebase.once("value", function(snapshot) {
        console.log('first posts added');
        resolve(null, snapshot.val(), deferred);
      }, function (errorObject) {
        resolve(errorObject.code, null, deferred);
      });
      promise = deferred.promise;
      return promise;
    },

    getAllPosts: function() {
      var deferred = $q.defer();
      var firebase = new Firebase(FirebaseUrl + '/posts');
      firebase.orderByChild('time').limitToLast(7).once("value", function(snapshot) {
        console.log('first posts added');
        resolve(null, snapshot.val(), deferred);
      }, function (errorObject) {
        resolve(errorObject.code, null, deferred);
      });
      promise = deferred.promise;
      return promise;
    },

    getAllPostsInfinite: function(timestamp) {
      var deferred = $q.defer();
      var firebase = new Firebase(FirebaseUrl + '/posts');
      firebase.orderByChild('time').endAt(timestamp).limitToLast(7).once("value", function(snapshot) {
        console.log('more posts added');
        resolve(null, snapshot.val(), deferred);
      }, function (errorObject) {
        resolve(errorObject.code, null, deferred);
      });
      promise = deferred.promise;
      return promise;
    },

    getAllPostsVoted: function(id, limit) {
      var deferred = $q.defer();
      var firebase = new Firebase(FirebaseUrl + '/posts');
      firebase.orderByChild("voters/" + id).startAt("A").endAt("B").limitToLast(limit).once("value", function(snapshot) {
        console.log('first posts added');
        resolve(null, {values: snapshot.val(), number: snapshot.numChildren()}, deferred);
      }, function (errorObject) {
        resolve(errorObject.code, null, deferred);
      });
      promise = deferred.promise;
      return promise;
    },

    getAllPostsVotedInfinite: function(id, actual, limit) {
      var deferred = $q.defer();
      var firebase = new Firebase(FirebaseUrl + '/posts');
      firebase.orderByChild("voters/"+ id).startAt("A").endAt("B").limitToLast(actual + limit).once("value", function(snapshot) {
        console.log('more post added');
        resolve(null, {values: snapshot.val(), number: snapshot.numChildren()}, deferred);
      }, function (errorObject) {
        resolve(errorObject.code, null, deferred);
      });
      promise = deferred.promise;
      return promise;
    },

     getPostsById: function(id, limit) {
      var deferred = $q.defer();
      var firebase = new Firebase(FirebaseUrl + '/posts');
      firebase.orderByChild('userId').equalTo(id).limitToLast(limit).once("value", function(snapshot) {
        resolve(null, {values: snapshot.val(), number: snapshot.numChildren()}, deferred);
      }, function (errorObject) {
        resolve(errorObject.code, null, deferred);
      });
      promise = deferred.promise;
      return promise;
    },

    getPostsByIdInfinite: function(id, actual, limit) {
      var deferred = $q.defer();
      var firebase = new Firebase(FirebaseUrl + '/posts');
      firebase.orderByChild('userId').equalTo(id).limitToLast(actual + limit).once("value", function(snapshot) {
        resolve(null, {values: snapshot.val(), number: snapshot.numChildren()}, deferred);
      }, function (errorObject) {
        resolve(errorObject.code, null, deferred);
      });
      promise = deferred.promise;
      return promise;
    },

    addPostToDelete: function(view, id) {
      postDeleteList[view][id] = true;
    },

    postToDelete: function(pageName) {
      for (var key in postDeleteList[pageName]) {
        //Remove element from the page
        angular.element('#' + pageName +' .card[data-postid='+ key +']').fadeOut();      
      }
      // Clear the vote to update object
      postDeleteList[pageName] = {};
      return;
    },

    getAndDeleteFirstElementInObject: function(obj) {
      var currentLastPost;
      for (var firstElement in obj) {
        currentLastPost = obj[firstElement].time;
        delete obj[firstElement];
        break;
      }
      return { currentLastPost: currentLastPost, obj: obj};
    },

    getFirstElementInObject: function(obj) {
      var currentLastPost;
      for (var firstElement in obj) {
        currentLastPost = obj[firstElement].time;
        break;
      }
      return { currentLastPost: currentLastPost, id: firstElement};
    }
  }
}]);
