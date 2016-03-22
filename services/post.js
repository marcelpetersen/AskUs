angular.module('myApp.postService', [])

.factory('Post', ['$q', '$rootScope', 'FirebaseUrl', 'currentUserInfos', '$state', function($q, $rootScope, FirebaseUrl, currentUserInfos, $state) {

  var singlePostInfo = {};

  resolve = function(errval, retval, deferred) {
    $rootScope.$apply(function() {
      if (errval) {
        deferred.reject(errval);
      } else {
        deferred.resolve(retval);
      }
    });
  }

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

    getAllPosts: function() {
      var deferred = $q.defer();
      var firebase = new Firebase(FirebaseUrl + '/posts');
      firebase.orderByChild('time').limitToLast(5).once("value", function(snapshot) {
        console.log('first post added');
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
      firebase.orderByChild('time').endAt(timestamp).limitToLast(5).once("value", function(snapshot) {
        console.log('more post added');
        resolve(null, snapshot.val(), deferred);
      }, function (errorObject) {
        resolve(errorObject.code, null, deferred);
      });
      promise = deferred.promise;
      return promise;
    },

     getPostsById: function(id) {
      var deferred = $q.defer();
      var firebase = new Firebase(FirebaseUrl + '/posts');
      firebase.orderByChild('userId').equalTo(id).once("value", function(snapshot) {
        resolve(null, snapshot.val(), deferred);
      }, function (errorObject) {
        resolve(errorObject.code, null, deferred);
      });
      promise = deferred.promise;
      return promise;
    },

    singlePostInfoSet: function(data) {
      singlePostInfo = data;
    },

    singlePostInfoGet: function() {
      return singlePostInfo;
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
