angular.module('myApp.postService', [])

.factory('Post', ['$q', '$rootScope', 'FirebaseUrl', 'currentUserInfos', '$state', function($q, $rootScope, FirebaseUrl, currentUserInfos, $state) {

  var singlePostInfo = {};

  resolve = function(errval, retval, deferred) {
    $rootScope.$apply(function() {
      if (errval) {
        deferred.reject(errval);
      } else {
        // No Need This
        // retval.connected = true;
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
    getAllPosts: function() {
      var deferred = $q.defer();
      var firebase = new Firebase(FirebaseUrl + '/posts');
      firebase.orderByChild('time').limitToLast(5).once("value", function(snapshot) {
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
    }
  }
}]);
