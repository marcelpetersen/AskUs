angular.module('myApp.postService', [])

.factory('Post', function($q, $rootScope, FirebaseUrl, currentUserInfos, $state) {

   resolve = function(errval, retval, deferred) {
    $rootScope.$apply(function() {
      if (errval) {
        deferred.reject(errval);
      } else {
        retval.connected = true;
        deferred.resolve(retval);
      }
    });
  }

  return {
    addPost: function(postData) {
      var userInfo = currentUserInfos.currentUserInfoGet();
      postData.userId = userInfo.id;
      postData.userName = userInfo.displayName;
      postData.userPicture = userInfo.profileImageURL;
      var d = new Date();
      var n = d.getTime();
      postData.time = n;

      var firebase = new Firebase(FirebaseUrl + '/posts');
      firebase.push(postData, function(snapshot) {
        console.log('post saved');
      });
    },
    getAllPosts: function() {
      var deferred = $q.defer();
      var firebase = new Firebase(FirebaseUrl + '/posts');
      firebase.orderByChild('timestamp').once("value", function(snapshot) {
        console.log(snapshot.val());
        // return snapshot.val();
        resolve(null, snapshot.val(), deferred);
      }, function (errorObject) {
        // console.log("The read failed: " + errorObject.code);
        resolve(errorObject.code, null, deferred);
      });

      promise = deferred.promise;
      return promise;
    }
  }
});
