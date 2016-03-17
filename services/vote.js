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

      var firebase = new Firebase(FirebaseUrl + '/posts/' + postId);
      firebase.child("voters").update(voterInfo, function(snapshot, error) {
        if(!error){
          // resolve(null, 'ok', deferred);
          console.log("vote ok")
          firebase.child('vote'+element+'Total').transaction(function(element) {
            return element+1;
          }, function(error, committed, snapshot) {
            if (error) {
              console.log('Transaction failed abnormally!', error);
            } else if (!committed) {
              console.log('Vote not saved  (because already exists).');
            } else {
              resolve(null, 'ok', deferred);
              console.log('vote saved db!');
            }
            console.log("Wilma's data: ", snapshot.val());
          });
        } else {
          resolve(error, null, deferred);
          console.log("vote ko");
        }
      });
      promise = deferred.promise;
      return promise;
    },
    addRadial: function(element, key, color, total, duration) {
      var radial = new RadialProgressChart('.results-'+ element +'[data-postid='+ key +']', {
        diameter: 70,
        max: 100,
        round: false,
        series: [{
          value: total,
          color: color
        }],
        animation: {
            duration: duration
        },
         shadow: {
            width: 1
        },
        stroke: {
            width: 20,
            gap: 2
        },
        center: function(d) {
          return total + ' %'
        }
      });

      return radial;
    }
  }

}]);
