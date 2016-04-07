angular.module('AskUs.voteService', [])

.factory('Vote', ['$q', '$rootScope', '$timeout', 'FirebaseUrl', 'currentUserInfos', function($q, $rootScope, $timeout, FirebaseUrl, currentUserInfos) {

  resolve = function(errval, retval, deferred) {
    $rootScope.$apply(function() {
      if (errval) {
        deferred.reject(errval);
      } else {
        deferred.resolve(retval);
      }
    });
  };

  // List ob post to update when commin back to previous pages
  var voteUpdateList = {
    'dash-page':{},
    'dash-filter-page': {}
  };

  return {
    addVote: function(postId, element) {
      var user = currentUserInfos.currentUserInfoGet();
      var deferred = $q.defer();

      var voterInfo = {};
      voterInfo[user.id] = element;

      var firebase = new Firebase(FirebaseUrl + '/posts/' + postId);
      firebase.once('value', function(snapshot, error) {
        if (snapshot.exists()) {
          firebase.child("voters").update(voterInfo, function(snapshot, error) {
            if(!error){
              // resolve(null, 'ok', deferred);
              console.log("vote ok")
              firebase.child('vote'+element+'Total').transaction(function(element) {
                return element+1;
              }, function(error, committed, snapshot) {
                if (error) {
                  resolve(error, null, deferred);
                  console.log('Transaction failed abnormally!', error);
                } else if (!committed) {
                  resolve(error, null, deferred);
                  console.log('Vote not saved  (because already exists).');
                } else {
                  resolve(null, 'ok', deferred);
                  console.log('vote saved db!');
                }
              });
            } else {
              resolve(error, null, deferred);
              console.log("vote ko");
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

    addRadial: function(element, key, color, total, duration, pageName) {
      var radial = new RadialProgressChart(pageName + ' .results-'+ element +'[data-postid='+ key +']', {
        diameter: 80,
        max: 100,
        round: false,
        series: [{
          value: total,
          color: '#FF4E50' //color
        }],
        animation: {
            duration: duration
        },
         shadow: {
            width: 1
        },
        stroke: {
            width: 10,
            gap: 2
        },
        center: function(d) {
          return total + ' %'
        }
      });
      return radial;
    },

    calculTotalRatio: function(a, b) {
      return Math.round(a * 100 /(a + b));
    },

    addVoteToUpdate: function(view, id, element, totalA, totalB) {
      voteUpdateList[view][id] = {
        element: element,
        totalA: totalA,
        totalB: totalB
      };
    },

    getVoteUpdateList: function() {
      return voteUpdateList;
    },

    voteUpdate: function(pageName) {
      for (var key in voteUpdateList[pageName]) {
      
          //Show Radial block hide Buttons
          angular.element('#' + pageName +' .card[data-postid='+ key +']').addClass('voted voted-'+ voteUpdateList[pageName][key].element);
          angular.element('#' + pageName +' .card[data-postid='+ key +'] .vote-buttons-container').addClass('ng-hide');
          angular.element('#' + pageName +' .card[data-postid='+ key +'] .results-container').removeClass('ng-hide');

          // Keep for now
          // angular.element('#' + pageName +' .card[data-postid='+ post.$key +'] .vote-buttons-container').hide();
          // angular.element('#' + pageName +' .card[data-postid='+ post.$key +'] .results-container').show();

          var radialA = new RadialProgressChart('#' + pageName + ' .results-A[data-postid='+ key +']', {
            diameter: 80,
            max: 100,
            round: false,
            series: [{
              value: voteUpdateList[pageName][key].totalA,
              color: '#FF4E50' //'#33cd5f'
            }],
            animation: {
                duration: 1
            },
             shadow: {
                width: 1
            },
            stroke: {
                width: 10,
                gap: 2
            },
            center: voteUpdateList[pageName][key].totalA + ' %'
          });

          var radialB = new RadialProgressChart('#' + pageName + ' .results-B[data-postid='+ key +']', {
            diameter: 80,
            max: 100,
            round: false,
            series: [{
              value: voteUpdateList[pageName][key].totalB,
              color: '#FF4E50' //'#387ef5'
            }],
            animation: {
                duration: 1
            },
             shadow: {
                width: 1
            },
            stroke: {
                width: 10,
                gap: 2
            },
            center: voteUpdateList[pageName][key].totalB + ' %'
          });
      }
      // Clear the vote to update object
      voteUpdateList[pageName] = {};
      return;
    }
  }

}]);
