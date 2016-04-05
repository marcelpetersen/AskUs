angular.module('myApp.announcementService', [])

.factory('Announcement', ['$q', '$rootScope', '$timeout', 'FirebaseUrl', function($q, $rootScope, $timeout, FirebaseUrl) {

  resolve = function(errval, retval, deferred) {
    $rootScope.$apply(function() {
      if (errval) {
        deferred.reject(errval);
      } else {
        deferred.resolve(retval);
      }
    });
  };

  return {
    getSpecialAnnouncement: function() {
      var deferred = $q.defer();

      var announcement;

      var firebase = new Firebase(FirebaseUrl + '/announcement');
      firebase.once('value', function(snapshot, error) {
        if(!error){
          console.log('getting announcement');
          var data = snapshot.val();
          resolve(null, data, deferred);
        } else {
          resolve(error, null, deferred);
          console.log("error getting announcement")
        }
      })
      promise = deferred.promise;
      return promise;
    }
  }

}]);
