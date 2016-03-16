angular.module('myApp.voteService', [])

.factory('Vote', ['$q', '$rootScope', 'FirebaseUrl', function($q, $rootScope, FirebaseUrl) {

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
    addVote: function(postId, userId, element) {
      var deferred = $q.defer();

      var voterInfo = {};
      voterInfo[userId] = element;

      var firebase = new Firebase(FirebaseUrl + '/posts/' + postId + "/voters");
      firebase.set(voterInfo, function(snapshot, error) {
        if(!error){
          resolve(null, 'ok', deferred);
        } else {
          resolve(error, null, deferred);
        }
      });
      promise = deferred.promise;
      return promise;
    }
  }

}]);
