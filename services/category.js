angular.module('AskUs.categoriesService', [])

.factory('Categories', ['$q', '$rootScope', 'FirebaseUrl', function($q, $rootScope, FirebaseUrl) {

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
    getAllPostsByCategory: function(category, limit) {
      var deferred = $q.defer();
      var firebase = new Firebase(FirebaseUrl + '/posts');
      firebase.orderByChild('category').equalTo(category).limitToLast(limit).once("value", function(snapshot) {
        //console.log('First posts added');
        resolve(null, {values: snapshot.val(), number: snapshot.numChildren()}, deferred);
      }, function (errorObject) {
        resolve(errorObject.code, null, deferred);
      });
      promise = deferred.promise;
      return promise;
    },

    getAllPostsByCategoryInfinite: function(category, actual, limit) {
      var deferred = $q.defer();
      var firebase = new Firebase(FirebaseUrl + '/posts');
      firebase.orderByChild('category').equalTo(category).limitToLast(actual + limit).once("value", function(snapshot) {
        //console.log('More posts added');
        resolve(null, {values: snapshot.val(), number: snapshot.numChildren()}, deferred);
      }, function (errorObject) {
        resolve(errorObject.code, null, deferred);
      });
      promise = deferred.promise;
      return promise;
    },

    getFirstXElements: function(obj, number) {
      var newObjToAdd = {};
      var numberMax = 1; 
      for (var element in obj) {
        newObjToAdd[element] = obj[element];
        if ( numberMax === number) {
          break;
        }
        numberMax++;
      }
      return newObjToAdd;
    },

    getCategoriesList: function() {
      return [
        {
          name: "animals",
          icon: "ion-ios-paw"
        },
        {
          name: "art",
          icon: "ion-paintbrush"
        },
        {
          name: "fashion",
          icon: "ion-tshirt"
        },
        {
          name: "food",
          icon: "ion-icecream"
        },
        {
          name: 'game',
          icon: "ion-ios-game-controller-b"
        },
        {
          name: "movies",
          icon: "ion-ios-film"
        },
        {
          name: "people",
          icon: "ion-person"
        },
        {
          name: "sport",
          icon: "ion-ios-basketball"
        },
        {
          name: "technology",
          icon: "ion-laptop"
        },
        {
          name: "travel",
          icon: "ion-android-plane"
        },
        {
          name: "vehicule",
          icon: "ion-model-s"
        }
      ]}
    }

  }]);