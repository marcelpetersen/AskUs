angular.module('myApp.legals', ['myApp.env'])

.controller('legalsCtrl', ['$scope', function($scope) {

  var options = {
    location: 'yes',
    clearcache: 'yes',
    toolbar: 'no'
  };

  $scope.openBrowser = function(url) {
    cordova.InAppBrowser.open(url, '_blank', options)
      .then(function(event) {
        console.log("external link opened");
      })
      .catch(function(event) {
        console.log("external link error");
      });
  }


}]);