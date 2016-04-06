angular.module('myApp.commentsService', [])

.factory('Comments', ['$q', '$rootScope', 'FirebaseUrl', 'currentUserInfos', function($q, $rootScope, FirebaseUrl, currentUserInfos) {

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

    addComment: function(postId, comment) {
      var user = currentUserInfos.currentUserInfoGet();
      var deferred = $q.defer();

      var commentInfo = {};
      commentInfo.userId = user.id;
      commentInfo.userName = user.displayName;
      commentInfo.userPicture = user.profileImageURL;
      commentInfo.comment = comment;
      var d = new Date();
      var n = d.getTime();
      commentInfo.time = n;

      var firebaseComments = new Firebase(FirebaseUrl + '/comments/' + postId);
      var firebase = new Firebase(FirebaseUrl + '/posts/' + postId);
      firebase.once('value', function(snapshot, error) {
        if (snapshot.exists()) {
          firebaseComments.push(commentInfo, function(snapshot, error) {
            if(!error){
              // resolve(null, 'ok', deferred);
              console.log("comment ok")
              firebase.child('totalMessages').transaction(function(element) {
                return element+1;
              }, function(error, committed, snapshot) {
                if (error) {
                  resolve(error, null, deferred);
                  console.log('Transaction failed abnormally!', error);
                } else if (!committed) {
                  resolve(error, null, deferred);
                  console.log('comment not saved (because already exists).');
                } else {
                  resolve(null, 'ok', deferred);
                  console.log('comment saved db!');
                }
              });
            } else {
              resolve(error, null, deferred);
              console.log("comment ko");
            }
          });
        } else {
          var noPostErr = {noPost: true} 
          resolve(noPostErr, null, deferred);
          console.log("post doesn't exist anymore");
        }
      })
      promise = deferred.promise;
      return promise;
    },

    getComments: function(postId) {
      var deferred = $q.defer();
      var firebase = new Firebase(FirebaseUrl + '/comments');
      firebase.child(postId).orderByChild('time').limitToLast(10).once("value", function(snapshot) {
        console.log('first message function');
        resolve(null, {values: snapshot.val(), number: snapshot.numChildren()}, deferred);
      }, function (errorObject) {
        resolve(errorObject.code, null, deferred);
      });
      promise = deferred.promise;
      return promise;
    },

    getCommentsInfinite: function(postId, timestamp) {
      var deferred = $q.defer();
      var firebase = new Firebase(FirebaseUrl + '/comments');
      firebase.child(postId).orderByChild('time').endAt(timestamp).limitToLast(10).once("value", function(snapshot) {
        console.log('more posts function');
        resolve(null, {values: snapshot.val(), number: snapshot.numChildren()}, deferred);
      }, function (errorObject) {
        resolve(errorObject.code, null, deferred);
      });
      promise = deferred.promise;
      return promise;
    },
  }
}]);
