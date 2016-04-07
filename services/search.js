angular.module('AskUs.searchService', [])

.factory('Search', ['$q', '$rootScope', 'FirebaseUrl', function($q, $rootScope, FirebaseUrl) {

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
    searchFunction: function(input, item, key) {
      var deferred = $q.defer();

      var firebase = new Firebase(FirebaseUrl + item);
      var inputUpperCase = input.toUpperCase();
      var inputLowerCase = input.toLowerCase();

      firebase.orderByChild(key).startAt(input).endAt(input + "~").limitToFirst(5).once("value", function(snapshot) {  // strict
        var strictSearch = snapshot.val();
        if (!strictSearch) {
          strictSearch = {};
        }

        firebase.orderByChild(key).startAt(inputUpperCase).endAt(inputLowerCase + "~").limitToFirst(10).once("value", function(largeSnapshot) {  // large
          var largeSearch = largeSnapshot.val();
          if (!largeSearch) {
            largeSearch = {};
          }
          updatedSeach = angular.extend({}, strictSearch, largeSearch);

          if(Object.keys(updatedSeach).length === 0) {
            resolve({empty: true}, null, deferred);
          }
          resolve(null, updatedSeach, deferred);
        }, function (errorObject) {
          resolve(errorObject.code, null, deferred);
        });
      }, function (errorObject) {
        resolve(errorObject.code, null, deferred);
      });

      promise = deferred.promise;
      return promise;
    }
  }
}]);
