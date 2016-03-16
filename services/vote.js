angular.module('myApp.voteService', [])

.factory('Vote', ['$q', '$rootScope', 'FirebaseUrl', 'currentUserInfos', function($q, $rootScope, FirebaseUrl, currentUserInfos) {

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
    addVote: function(postId, element) {
      var user = currentUserInfos.currentUserInfoGet();
      var deferred = $q.defer();

      var voterInfo = {};
      voterInfo[user.id] = element;

      console.log('voter',voterInfo)

      var firebase = new Firebase(FirebaseUrl + '/posts/' + postId + "/voters");
      firebase.update(voterInfo, function(snapshot, error) {
        if(!error){
          resolve(null, 'ok', deferred);
          console.log("vote ok")
        } else {
          resolve(error, null, deferred);
          console.log("vote ko");
        }
      });
      promise = deferred.promise;
      return promise;
    }
  }

}]);
