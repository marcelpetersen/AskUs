angular.module('myApp.facebookService', [])

.factory('facebook', ['$q', '$rootScope', 'FirebaseUrl', 'currentUserInfos', function($q, $rootScope, FirebaseUrl, currentUserInfos) {

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
    getFriends: function($scope, userDetail) {
        var deferred = $q.defer();
        if (userDetail) {
          userDetail = JSON.parse(userDetail);
          // FACEBOOK GET FRIENDS LIST
          FB.api(
            "/" + userDetail.facebook.id + "/friends?access_token=" + userDetail.facebook.accessToken + "&fields=name,id,email,picture",
            function (response) {
              if (response && !response.error) {
                resolve(null, response.data, deferred);
              } else {
                resolve(response.error, null, deferred);
              }
            }
          );
        } else {
          resolve(null, "no friend", deferred);
        }
         promise = deferred.promise;
    
      return promise;
    },
    updateFriendsList: function(friendsList) {
      if (friendsList.length > 0) {
      var userId = currentUserInfos.currentUserInfoGet();
      userId = userId.id;

      var firebase = new Firebase(FirebaseUrl + '/');
      var userRef = firebase.child("users/" + userId + "/friends/");
      userRef.set(friendsList, function(snapshot) {
        console.log('friend list saved');
      });
    } else {
      console.log('no friend to store');
    }
    }
  }
}]);
