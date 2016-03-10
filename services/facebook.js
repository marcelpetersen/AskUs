angular.module('myApp.facebookService', [])

.factory('facebook', function($q, $rootScope) {

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
          // $scope.noFriend = true;
          // $scope.$broadcast('scroll.refreshComplete');
        }
         promise = deferred.promise;
    
      return promise;
    }
  }

  // return {
    // getFriends: function($scope, userDetail) {
    //     if (userDetail) {
    //       userDetail = JSON.parse(userDetail);
    //       // FACEBOOK GET FRIENDS LIST
    //       FB.api(
    //         "/" + userDetail.facebook.id + "/friends?access_token=" + userDetail.facebook.accessToken + "&fields=name,id,email,picture",
    //         function (response) {
    //           if (response && !response.error) {
    //             $scope.friendsList = response.data;
    //             $scope.$apply();                
    //             $scope.$broadcast('scroll.refreshComplete');
    //           } else {
    //             console.log('error', response.error)
    //             $scope.$broadcast('scroll.refreshComplete');
    //           }
    //         }
    //       );
    //     } else {
    //       $scope.noFriend = true;
    //       $scope.$broadcast('scroll.refreshComplete');
    //     }
    // }
  // }
});
