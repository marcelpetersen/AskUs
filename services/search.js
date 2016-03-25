angular.module('myApp.searchService', [])

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

  // List ob post to delete when commin back to previous pages
  var postDeleteList = {
    'dash-page':{},
    'dash-filter-page': {},
    'user-page': {},
    'my-votes-page': {},
  };

  return {
    searchFunction: function(input) {
      var deferred = $q.defer();

      var firebase = new Firebase(FirebaseUrl + '/posts');
      var inputUpperCase = input.toUpperCase();
      var inputLowerCase = input.toLowerCase();

      firebase.orderByChild('title').startAt(input).endAt(input + "~").limitToLast(5).once("value", function(snapshot) {  // strict
        var strictSearch = snapshot.val();
        if (!strictSearch) {
          strictSearch = {};
        }

        firebase.orderByChild('title').startAt(inputUpperCase).endAt(inputLowerCase + "~").limitToLast(10).once("value", function(largeSnapshot) {  // large
          var largeSearch = largeSnapshot.val();
          if (!largeSearch) {
            largeSearch = {};
          }
          updatedSeach = angular.extend({}, strictSearch, largeSearch);

          if(Object.keys(updatedSeach).length === 0) {
            resolve({error: true}, null, deferred);
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
